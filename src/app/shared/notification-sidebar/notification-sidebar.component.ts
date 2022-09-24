import {
  Component,
  OnInit,
  ElementRef,
  Renderer2,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { LayoutService } from '../services/layout.service';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from '../services/notifications.service';
import * as Moment from 'moment';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-notification-sidebar',
  templateUrl: './notification-sidebar.component.html',
  styleUrls: ['./notification-sidebar.component.scss']
})
export class NotificationSidebarComponent implements OnInit, OnDestroy {
  layoutSub: Subscription;
  isOpen = false;
  notifications$: Observable<any>;

  @ViewChild('sidebar') sidebar: ElementRef;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private layoutService: LayoutService,
    private auth: AuthService,
    private notificationsService: NotificationsService
  ) {
    this.layoutSub = layoutService.changeEmitted$.subscribe(value => {
      if (this.isOpen) {
        this.renderer.removeClass(this.sidebar.nativeElement, 'open');
        this.isOpen = false;
      } else {
        this.renderer.addClass(this.sidebar.nativeElement, 'open');
        this.isOpen = true;
      }
    });
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));
    if(this.auth.isAdmin()){
      this.auth.main_office$.subscribe(() => {
      this.notifications$ = this.notificationsService.get({
        page:1,
        per_page: 5
      });
    });
    }
    
    // alert('!');
  }
  ngOnDestroy() {
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
  }

  onClose() {
    this.renderer.removeClass(this.sidebar.nativeElement, 'open');
    this.isOpen = false;
  }

  fromNow(fecha: string): string {
    return Moment(fecha).fromNow();
  }
}
