import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, inject } from '@angular/core';

/** Fades/slides an element in when it scrolls into view. Usage: <div reveal [revealDelay]="100"> */
@Directive({ selector: '[reveal]', standalone: true })
export class RevealDirective implements OnInit, OnDestroy {
  @Input() revealDelay = 0;
  @Input('reveal') variant: '' | 'left' | 'right' | 'zoom' = '';
  private el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private io?: IntersectionObserver;

  ngOnInit() {
    this.el.classList.add('reveal');
    if (this.variant) this.el.classList.add('reveal-' + this.variant);
    this.el.style.transitionDelay = this.revealDelay + 'ms';
    this.io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.el.classList.add('in');
        this.io?.disconnect();
      }
    }, { threshold: 0.12 });
    this.io.observe(this.el);
  }

  ngOnDestroy() { this.io?.disconnect(); }
}

/** Counts up to a number once visible. */
@Directive({ selector: '[countTo]', standalone: true })
export class CountToDirective implements OnInit, OnDestroy {
  @Input({ required: true }) countTo = 0;
  @Input() suffix = '';
  private el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private io?: IntersectionObserver;
  private raf = 0;

  ngOnInit() {
    this.el.textContent = '0' + this.suffix;
    this.io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      this.io?.disconnect();
      const start = performance.now();
      const dur = 1600;
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        this.el.textContent = Math.round(this.countTo * eased).toLocaleString() + this.suffix;
        if (p < 1) this.raf = requestAnimationFrame(tick);
      };
      this.raf = requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    this.io.observe(this.el);
  }

  ngOnDestroy() {
    this.io?.disconnect();
    cancelAnimationFrame(this.raf);
  }
}

/** 3D tilt + moving glare following the pointer. */
@Directive({ selector: '[tilt]', standalone: true })
export class TiltDirective {
  private el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  @HostListener('mousemove', ['$event']) move(e: MouseEvent) {
    const r = this.el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    this.el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 10}deg) rotateY(${(x - 0.5) * 12}deg) translateY(-4px)`;
    this.el.style.setProperty('--mx', x * 100 + '%');
    this.el.style.setProperty('--my', y * 100 + '%');
  }

  @HostListener('mouseleave') leave() {
    this.el.style.transform = '';
  }
}
