import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  effect,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ProjectsService } from '../core/services/projects.service';
import { CertificatesService } from '../core/services/certificates.service';
import { Project } from '../core/models/projects.model';
import { Certificate } from '../core/models/certificate.model';
import { LanguageService } from '../core/i18n/language.service';
import { Lang, extractLang } from '../core/i18n/multilang';

type FsNode = FsDir | FsFile;

interface FsDir {
  type: 'dir';
  children: Record<string, FsNode>;
}

interface FsFile {
  type: 'file';
  content: string;
}

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

function helpText(lang: Lang): string {
  return lang === 'en'
    ? `Available commands:
  ls [-la]        list files and folders in the current directory
  cd <folder>      change directory (cd .. goes back, cd ~ goes to root)
  cat <file>       print a file's contents
  pwd              print the current path
  tree             print the full tree from the root
  whoami           who you are here
  clear            clear the screen
  help             show this list`
    : `Comandos disponíveis:
  ls [-la]        lista arquivos e pastas do diretório atual
  cd <pasta>      entra em uma pasta (cd .. volta, cd ~ vai pra raiz)
  cat <arquivo>   mostra o conteúdo de um arquivo
  pwd             mostra o caminho atual
  tree            mostra a árvore completa a partir da raiz
  whoami          quem é você aqui
  clear           limpa a tela
  help            mostra esta lista`;
}

function readmeText(lang: Lang): string {
  return lang === 'en'
    ? `Welcome to the portfolio terminal.

This is a second way to browse the same content on the site, except
as a real file system.

Type 'help' to see the commands, or 'ls' to see what's here. The
projects and certificates below are loaded live from the same API
that powers the rest of the site.`
    : `Bem-vindo ao terminal do portfólio.

Isso aqui é uma segunda forma de navegar pelo mesmo conteúdo do site,
só que como um sistema de arquivos de verdade.

Digite 'help' para ver os comandos, ou 'ls' pra ver o que tem aqui.
Os projetos e certificados abaixo são carregados ao vivo da mesma API
que alimenta o resto do site.`;
}

function sobreText(lang: Lang): string {
  return lang === 'en'
    ? `# About me

Pentester and full-stack developer. eJPT certified, with 15+ machines
compromised on HTB and TryHackMe applying PTES.

I work with Angular, Node.js, Java and Spring Boot day to day, which
gives me an architect's view when looking for flaws.

Away from the keyboard: Taekwondo, chess aiming for National Master,
and a published poetry book.`
    : `# Sobre mim

Pentester e desenvolvedor full-stack. Certificado eJPT, com 15+
máquinas comprometidas em HTB e TryHackMe aplicando PTES.

Trabalho com Angular, Node.js, Java e Spring Boot no dia a dia, o que
me dá visão de arquiteto na hora de procurar falhas.

Fora do teclado: Taekwondo, xadrez rumo a Mestre Nacional, e um livro
de poesia publicado.`;
}

function contatoText(lang: Lang): string {
  return lang === 'en'
    ? `# Contact

email:    kaenansilveira@outlook.com
linkedin: linkedin.com/in/nicolas-kaenan-silveira-68884b313
github:   github.com/NicolasKaenan
site:     kaenan.dev`
    : `# Contato

email:    kaenansilveira@outlook.com
linkedin: linkedin.com/in/nicolas-kaenan-silveira-68884b313
github:   github.com/NicolasKaenan
site:     kaenan.dev`;
}

function emptyProjectsText(lang: Lang): string {
  return lang === 'en' ? 'No projects published yet.' : 'Nenhum projeto publicado ainda.';
}
function emptyCertificatesText(lang: Lang): string {
  return lang === 'en' ? 'No certificates published yet.' : 'Nenhum certificado publicado ainda.';
}
function loadErrorText(lang: Lang): string {
  return lang === 'en' ? "Couldn't load data from the API." : 'Não consegui carregar os dados da API.';
}

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

  private rawProjects: Project[] = [];
  private rawCertificates: Certificate[] = [];
  private loadError = false;

  private fs: FsDir = dir();
  private cwd: string[] = [];
  private history: string[] = [];
  private historyIdx = 0;
  private booted = false;

  constructor(
    private projectsService: ProjectsService,
    private certificatesService: CertificatesService,
    private languageService: LanguageService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    // Reconstrói o "sistema de arquivos" sempre que o idioma muda,
    // mantendo os nomes de pastas/arquivos estáveis (baseados sempre
    // no texto em PT) e só o conteúdo mudando de idioma.
    effect(() => {
      this.languageService.lang();
      this.rebuildFs();
    });
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.projectsService.getAll().subscribe({
      next: (projects) => {
        this.rawProjects = projects;
        this.rebuildFs();
      },
      error: () => {
        this.loadError = true;
        this.rebuildFs();
      },
    });

    this.certificatesService.getAll().subscribe({
      next: (certs) => {
        this.rawCertificates = certs;
        this.rebuildFs();
      },
      error: () => {
        this.loadError = true;
        this.rebuildFs();
      },
    });
  }

  private rebuildFs(): void {
    const lang = this.languageService.lang();

    const projetosDir: Record<string, FsNode> = {};
    for (const p of this.rawProjects) {
      const slug = slugify(extractLang(p.title, 'pt')) + '.md';
      const title = extractLang(p.title, lang);
      const desc = extractLang(p.shortened_description, lang);
      const tags = p.postTags?.map((t) => t.name).join(', ') || '-';
      const content = `# ${title}\n\n${desc}\n\ntags: ${tags}\n${lang === 'en' ? 'project' : 'projeto'}: ${p.project_url || '-'}\n${lang === 'en' ? 'repository' : 'repositório'}: ${p.repository_url || '-'}`;
      projetosDir[slug] = file(content);
    }

    const certificadosDir: Record<string, FsNode> = {};
    for (const c of this.rawCertificates) {
      const slug = slugify(extractLang(c.title, 'pt')) + '.txt';
      const title = extractLang(c.title, lang);
      const inst = extractLang(c.institution, lang);
      const desc = extractLang(c.shortenedDescription, lang);
      certificadosDir[slug] = file(`${title}\n${inst}\n\n${desc}`);
    }

    this.fs = dir({
      'README.md': file(readmeText(lang)),
      'sobre.md': file(sobreText(lang)),
      'contato.md': file(contatoText(lang)),
      projetos: this.loadError
        ? dir({ 'erro.txt': file(loadErrorText(lang)) })
        : Object.keys(projetosDir).length > 0
          ? dir(projetosDir)
          : dir({ 'vazio.txt': file(emptyProjectsText(lang)) }),
      certificados: this.loadError
        ? dir({ 'erro.txt': file(loadErrorText(lang)) })
        : Object.keys(certificadosDir).length > 0
          ? dir(certificadosDir)
          : dir({ 'vazio.txt': file(emptyCertificatesText(lang)) }),
    });
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
    const lang = this.languageService.lang();
    this.print(
      `<span class="ok">${lang === 'en' ? 'Connected to kaenan@portfolio.' : 'Conectado a kaenan@portfolio.'}</span>`
    );
    this.print(helpText(lang).replace(/\n/g, '<br>'));
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
    const lang = this.languageService.lang();
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
        this.print(helpText(lang).replace(/\n/g, '<br>'));
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
          const msg = lang === 'en'
            ? `cd: ${this.escapeHtml(arg)}: no such file or directory`
            : `cd: ${this.escapeHtml(arg)}: arquivo ou diretório não encontrado`;
          this.print(`<span class="err">${msg}</span>`);
          break;
        }
        if (node.type !== 'dir') {
          const msg = lang === 'en'
            ? `cd: ${this.escapeHtml(arg)}: not a directory`
            : `cd: ${this.escapeHtml(arg)}: não é um diretório`;
          this.print(`<span class="err">${msg}</span>`);
          break;
        }
        this.cwd = target;
        this.promptPath.set(this.pathStr(this.cwd));
        break;
      }
      case 'cat': {
        if (!arg) {
          this.print(`<span class="err">${lang === 'en' ? 'cat: missing file operand' : 'cat: informe um arquivo'}</span>`);
          break;
        }
        const target = this.resolve(arg);
        const node = this.getNode(target);
        if (!node) {
          const msg = lang === 'en'
            ? `cat: ${this.escapeHtml(arg)}: no such file`
            : `cat: ${this.escapeHtml(arg)}: arquivo não encontrado`;
          this.print(`<span class="err">${msg}</span>`);
          break;
        }
        if (node.type !== 'file') {
          const msg = lang === 'en'
            ? `cat: ${this.escapeHtml(arg)}: is a directory`
            : `cat: ${this.escapeHtml(arg)}: é um diretório`;
          this.print(`<span class="err">${msg}</span>`);
          break;
        }
        this.print(this.escapeHtml(node.content).replace(/\n/g, '<br>'));
        break;
      }
      default: {
        const msg = lang === 'en'
          ? `command not found: ${this.escapeHtml(cmd)}`
          : `comando não encontrado: ${this.escapeHtml(cmd)}`;
        this.print(`<span class="err">${msg}</span> (${lang === 'en' ? "type 'help'" : "digite 'help'"})`);
      }
    }
  }
}
