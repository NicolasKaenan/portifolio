import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ProjectsService } from '../core/services/projects.service';
import { Project } from '../core/models/projects.model';

type FsNode = FsDir | FsFile;

interface FsDir {
  type: 'dir';
  children: Record<string, FsNode>;
}

interface FsFile {
  type: 'file';
  content: string;
}

const CERTIFICATE_TAG = 'certificado';

function dir(children: Record<string, FsNode> = {}): FsDir {
  return { type: 'dir', children };
}
function file(content: string): FsFile {
  return { type: 'file', content };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const HELP_TEXT = `Comandos disponíveis:
  ls [-la]        lista arquivos e pastas do diretório atual
  cd <pasta>      entra em uma pasta (cd .. volta, cd ~ vai pra raiz)
  cat <arquivo>   mostra o conteúdo de um arquivo
  pwd             mostra o caminho atual
  tree            mostra a árvore completa a partir da raiz
  whoami          quem é você aqui
  clear           limpa a tela
  help            mostra esta lista`;

@Component({
  selector: 'app-terminal-drawer',
  standalone: true,
  imports: [],
  templateUrl: './terminal-drawer.html',
  styleUrl: './terminal-drawer.css',
})
export class TerminalDrawerComponent implements OnInit {
  @ViewChild('termScreen') termScreenRef?: ElementRef<HTMLDivElement>;
  @ViewChild('termInput') termInputRef?: ElementRef<HTMLInputElement>;

  open = signal(false);
  promptPath = signal('~');

  private fs: FsDir = dir({
    'README.md': file(
      `Bem-vindo ao terminal do portfólio.

Isso aqui é uma segunda forma de navegar pelo mesmo conteúdo do site,
só que como um sistema de arquivos de verdade.

Digite 'help' para ver os comandos, ou 'ls' pra ver o que tem aqui.
Os projetos e certificados abaixo são carregados ao vivo da mesma API
que alimenta o resto do site.`
    ),
    'sobre.md': file(
      `# Sobre mim

Pentester e desenvolvedor full-stack. Certificado eJPT, com 15+
máquinas comprometidas em HTB e TryHackMe aplicando PTES.

Trabalho com Angular, Node.js, Java e Spring Boot no dia a dia, o que
me dá visão de arquiteto na hora de procurar falhas.

Fora do teclado: Taekwondo, xadrez rumo a Mestre Nacional, e um livro
de poesia publicado.`
    ),
    'contato.md': file(
      `# Contato

email:    kaenansilveira@outlook.com
linkedin: linkedin.com/in/nicolas-kaenan-silveira-68884b313
github:   github.com/NicolasKaenan
site:     kaenan.dev`
    ),
    projetos: dir({ 'carregando.txt': file('Carregando projetos da API...') }),
    certificados: dir({ 'carregando.txt': file('Carregando certificados da API...') }),
  });

  private cwd: string[] = [];
  private history: string[] = [];
  private historyIdx = 0;
  private booted = false;

  constructor(
    private projectsService: ProjectsService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.projectsService.getAll().subscribe({
      next: (projects) => this.populateFs(projects),
      error: () => {
        this.fs.children['projetos'] = dir({
          'erro.txt': file('Não consegui carregar os projetos agora.'),
        });
        this.fs.children['certificados'] = dir({
          'erro.txt': file('Não consegui carregar os certificados agora.'),
        });
      },
    });
  }

  private populateFs(projects: Project[]): void {
    const projetosDir: Record<string, FsNode> = {};
    const certificadosDir: Record<string, FsNode> = {};

    for (const p of projects) {
      const isCert = p.postTags?.some(
        (t) => t.name?.toLowerCase() === CERTIFICATE_TAG
      );
      const name = `${slugify(p.title)}.md`;
      const tags = p.postTags?.map((t) => t.name).join(', ') || '-';
      const content = `# ${p.title}

${p.shortened_description}

tags: ${tags}
projeto: ${p.project_url || '-'}
repositório: ${p.repository_url || '-'}`;

      if (isCert) {
        certificadosDir[name] = file(content);
      } else {
        projetosDir[name] = file(content);
      }
    }

    this.fs.children['projetos'] =
      Object.keys(projetosDir).length > 0
        ? dir(projetosDir)
        : dir({ 'vazio.txt': file('Nenhum projeto publicado ainda.') });

    this.fs.children['certificados'] =
      Object.keys(certificadosDir).length > 0
        ? dir(certificadosDir)
        : dir({ 'vazio.txt': file('Nenhum certificado publicado ainda.') });
  }

  toggle(): void {
    this.open.update((v) => !v);
    if (this.open()) {
      if (!this.booted) {
        this.boot();
        this.booted = true;
      }
      setTimeout(() => this.termInputRef?.nativeElement.focus(), 320);
    }
  }

  close(): void {
    this.open.set(false);
  }

  onKeydown(e: KeyboardEvent): void {
    const input = this.termInputRef?.nativeElement;
    if (!input) return;

    if (e.key === 'Enter') {
      this.run(input.value);
      input.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.historyIdx > 0) {
        this.historyIdx--;
        input.value = this.history[this.historyIdx] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIdx < this.history.length - 1) {
        this.historyIdx++;
        input.value = this.history[this.historyIdx] || '';
      } else {
        this.historyIdx = this.history.length;
        input.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const parts = input.value.split(' ');
      const last = parts[parts.length - 1];
      const node = this.getNode(this.cwd);
      if (node && node.type === 'dir') {
        const candidates = Object.keys(node.children).filter((n) =>
          n.startsWith(last)
        );
        if (candidates.length === 1) {
          parts[parts.length - 1] = candidates[0];
          input.value = parts.join(' ');
        } else if (candidates.length > 1) {
          this.print(candidates.join('   '));
        }
      }
    }
  }

  private boot(): void {
    this.print('<span class="ok">Conectado a kaenan@portfolio.</span>');
    this.print(HELP_TEXT.replace(/\n/g, '<br>'));
  }

  private pathStr(arr: string[]): string {
    return arr.length ? '~/' + arr.join('/') : '~';
  }

  private getNode(arr: string[]): FsNode | null {
    let node: FsNode = this.fs;
    for (const seg of arr) {
      if (node.type !== 'dir' || !node.children[seg]) return null;
      node = node.children[seg];
    }
    return node;
  }

  private resolve(argPath: string): string[] {
    if (!argPath || argPath === '~') return [];
    let base = this.cwd.slice();
    if (argPath.startsWith('/') || argPath.startsWith('~/')) {
      base = [];
      argPath = argPath.replace(/^~?\//, '');
    }
    const parts = argPath.split('/').filter(Boolean);
    for (const p of parts) {
      if (p === '.') continue;
      else if (p === '..') base.pop();
      else base.push(p);
    }
    return base;
  }

  private listDir(node: FsDir, longFormat: boolean): string {
    const entries = Object.entries(node.children);
    if (entries.length === 0) return '(vazio)';
    return entries
      .map(([name, n]) => {
        const isDir = n.type === 'dir';
        const label = isDir
          ? `<span class="dirn">${name}/</span>`
          : name;
        if (longFormat) {
          const perms = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
          const size = isDir
            ? '4096'
            : String((n as FsFile).content.length).padStart(4, ' ');
          return `${perms}  kaenan kaenan  ${size}  ${label}`;
        }
        return label;
      })
      .join(longFormat ? '\n' : '   ');
  }

  private buildTree(): string {
    const lines: string[] = ['~'];
    const walk = (node: FsDir, prefix: string) => {
      const entries = Object.entries(node.children);
      entries.forEach(([name, n], i) => {
        const last = i === entries.length - 1;
        lines.push(prefix + (last ? '└── ' : '├── ') + name + (n.type === 'dir' ? '/' : ''));
        if (n.type === 'dir') {
          walk(n, prefix + (last ? '    ' : '│   '));
        }
      });
    };
    walk(this.fs, '');
    return lines.join('\n');
  }

  private escapeHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  private print(html: string): void {
    const screen = this.termScreenRef?.nativeElement;
    if (!screen) return;
    const d = document.createElement('div');
    d.className = 'l';
    d.innerHTML = html;
    screen.appendChild(d);
    screen.scrollTop = screen.scrollHeight;
  }

  private run(raw: string): void {
    const trimmed = raw.trim();
    if (trimmed) this.history.push(trimmed);
    this.historyIdx = this.history.length;

    this.print(
      `<span class="prompt">kaenan@portfolio:${this.pathStr(this.cwd)}$</span> ${this.escapeHtml(trimmed)}`
    );
    if (!trimmed) return;

    const [cmd, ...rest] = trimmed.split(/\s+/);
    const arg = rest.filter((a) => !a.startsWith('-')).join(' ');
    const flags = rest.filter((a) => a.startsWith('-')).join('');

    switch (cmd) {
      case 'help':
        this.print(HELP_TEXT.replace(/\n/g, '<br>'));
        break;
      case 'whoami':
        this.print('kaenan — AppSec / Pentest / Full-stack');
        break;
      case 'pwd':
        this.print(this.pathStr(this.cwd));
        break;
      case 'clear': {
        const screen = this.termScreenRef?.nativeElement;
        if (screen) screen.innerHTML = '';
        break;
      }
      case 'tree':
        this.print(this.buildTree().replace(/\n/g, '<br>'));
        break;
      case 'ls': {
        const node = this.getNode(this.cwd);
        if (node && node.type === 'dir') {
          this.print(this.listDir(node, flags.includes('l')).replace(/\n/g, '<br>'));
        }
        break;
      }
      case 'cd': {
        if (!arg) {
          this.cwd = [];
          this.promptPath.set(this.pathStr(this.cwd));
          break;
        }
        const target = this.resolve(arg);
        const node = this.getNode(target);
        if (!node) {
          this.print(`<span class="err">cd: ${this.escapeHtml(arg)}: arquivo ou diretório não encontrado</span>`);
          break;
        }
        if (node.type !== 'dir') {
          this.print(`<span class="err">cd: ${this.escapeHtml(arg)}: não é um diretório</span>`);
          break;
        }
        this.cwd = target;
        this.promptPath.set(this.pathStr(this.cwd));
        break;
      }
      case 'cat': {
        if (!arg) {
          this.print('<span class="err">cat: informe um arquivo</span>');
          break;
        }
        const target = this.resolve(arg);
        const node = this.getNode(target);
        if (!node) {
          this.print(`<span class="err">cat: ${this.escapeHtml(arg)}: arquivo não encontrado</span>`);
          break;
        }
        if (node.type !== 'file') {
          this.print(`<span class="err">cat: ${this.escapeHtml(arg)}: é um diretório</span>`);
          break;
        }
        this.print(this.escapeHtml(node.content).replace(/\n/g, '<br>'));
        break;
      }
      default:
        this.print(`<span class="err">comando não encontrado: ${this.escapeHtml(cmd)}</span> (digite 'help')`);
    }
  }
}
