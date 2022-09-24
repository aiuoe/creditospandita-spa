import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  AfterViewInit,
  Output,
  EventEmitter
} from '@angular/core';

import { ROUTES, ADMIN_ROUTES, CLIENT_ROUTES ,REFERIDOR_ROUTES, CLIENTREFERIDOR_ROUTES } from './sidebar-routes.config';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { customAnimations } from '../animations/custom-animations';
import { ConfigService } from '../services/config.service';
import { AuthService } from '../auth/auth.service';
import { element } from 'protractor';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  animations: customAnimations
})
export class SidebarComponent implements OnInit, AfterViewInit {
  @Output()
  toggleHideSidebar = new EventEmitter<Object>();
  @ViewChild('toggleIcon') toggleIcon: ElementRef;
  public menuItems: any[];
  depth: number;
  activeTitle: string;
  activeTitles: string[] = [];
  expanded: boolean;
  nav_collapsed_open = false;
  logoUrl = 'assets/img/logos/logo1.png';
  public config: any = {};

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private configService: ConfigService,
    private auth: AuthService
  ) {
    if (this.depth === undefined) {
      this.depth = 0;
      this.expanded = true;
    }
  }

  async ngOnInit() {
    this.config = this.configService.templateConf;

    /**
     * En caso de ser administrador se cargan las rutas admin
     * sino las default
     */
    // this.menuItems = this.auth.isAdmin() ? ADMIN_ROUTES : ROUTES;
    if(this.auth.isAdmin()){
      let modulosActivo = JSON.parse(localStorage.getItem('user')).ModulosActivos;
      if(modulosActivo){
        let menuActivo = JSON.parse(modulosActivo.modulos)
        let menufull = ADMIN_ROUTES;
        let menuFinal = []
        await menuActivo.forEach(async e =>{
          
          await menufull.forEach(async element =>{
            console.log(e+" --> ", element.title); 
            if(element.title.toUpperCase() === e.toUpperCase()){
             
              await menuFinal.push(element);
            }
            
          })
        })
        this.menuItems =menuFinal;
        // console.log("userMenu",modulosActivo)
      }else{
        this.menuItems =ADMIN_ROUTES;
      }
    }else if(this.auth.isClient()){
      this.menuItems =CLIENT_ROUTES;
    }else if(this.auth.isReferidor()){
      this.menuItems =REFERIDOR_ROUTES;
    }else if(this.auth.isReferidorCliente()){
      this.menuItems =CLIENTREFERIDOR_ROUTES;
    }

    if (this.config.layout.sidebar.backgroundColor === 'white') {
      this.logoUrl = 'assets/img/logos/logo1.png';
    } else {
      this.logoUrl = 'assets/img/logos/logo1.png';
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.config.layout.sidebar.collapsed !== undefined) {
        if (this.config.layout.sidebar.collapsed === true) {
          this.expanded = false;
          this.renderer.addClass(
            this.toggleIcon.nativeElement,
            'ft-toggle-left'
          );
          this.renderer.removeClass(
            this.toggleIcon.nativeElement,
            'ft-toggle-right'
          );
          this.nav_collapsed_open = true;
        } else if (this.config.layout.sidebar.collapsed === false) {
          this.expanded = true;
          // this.renderer.removeClass(
          //   this.toggleIcon.nativeElement,
          //   'ft-toggle-left'
          // );
          // this.renderer.addClass(
          //   this.toggleIcon.nativeElement,
          //   'ft-toggle-right'
          // );
          this.nav_collapsed_open = false;
        }
      }
    }, 0);
  }

  toggleSlideInOut() {
    this.expanded = !this.expanded;
  }

  handleToggle(titles) {
    this.activeTitles = titles;
  }
  toggleSidebar(toogle) {
    // const appSidebar = document.getElementsByClassName('app-sidebar')[0];
    // console.log(this.config.layout.sidebar.collapsed);
    // if (appSidebar.classList.contains('hide-sidebar')) {
    //   this.toggleHideSidebar.emit(false);
    // } else if(toogle) {
    //   this.expanded = true;
    //   this.nav_collapsed_open = true;
    //   this.toggleHideSidebar.emit(true);
    //   this.config.layout.sidebar.collapsed === true;
    //   // appSidebar.classList.add('hide-sidebar');
    //   console.log("click",toogle)
    // }else{
    //   this.expanded = false;
    //   this.nav_collapsed_open = false;
    //   this.toggleHideSidebar.emit(false);
    //   this.config.layout.sidebar.collapsed === false;
      
    // }
  }
  // NGX Wizard - skip url change
  ngxWizardFunction(path: string) {
    if (path.indexOf('forms/ngx') !== -1) {
      this.router.navigate(['forms/ngx/wizard'], { skipLocationChange: false });
    }
  }
}
