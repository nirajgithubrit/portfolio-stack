import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';

/** Soft glowing orb that eases toward the pointer (desktop / fine pointers only). */
@Component({
  selector: 'app-cursor',
  standalone: true,
  template: `<div #dot class="dot"></div>`,
  styles: [`
    .dot {
      position: fixed; top: 0; left: 0; width: 420px; height: 420px; margin: -210px 0 0 -210px;
      border-radius: 50%; pointer-events: none; z-index: 1; opacity: 0;
      background: radial-gradient(circle, color-mix(in srgb, var(--accent-2) 24%, transparent), transparent 65%);
      transition: opacity .4s; will-change: transform;
    }
    @media (pointer: coarse) { .dot { display: none; } }
  `],
})
export class CursorComponent implements OnInit, OnDestroy {
  @ViewChild('dot', { static: true }) dot!: ElementRef<HTMLElement>;
  private zone = inject(NgZone);
  private raf = 0;
  private tx = 0; private ty = 0; private x = 0; private y = 0;
  private onMove = (e: MouseEvent) => { this.tx = e.clientX; this.ty = e.clientY; this.dot.nativeElement.style.opacity = '1'; };

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      window.addEventListener('mousemove', this.onMove);
      const step = () => {
        this.x += (this.tx - this.x) * 0.12;
        this.y += (this.ty - this.y) * 0.12;
        this.dot.nativeElement.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.raf = requestAnimationFrame(step);
      };
      step();
    });
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('mousemove', this.onMove);
  }
}
