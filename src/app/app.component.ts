import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SwUpdate } from '@angular/service-worker';
import { ToastrService } from 'ngx-toastr';
import { OnesignalService } from './shared/auth/onesignal.service';
import { MessagingService } from './shared/auth/messaging.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  mesaggeReceived=''
  constructor(
    private router: Router,
    private swUpdate: SwUpdate,
    private toast: ToastrService,
    private onesignal: OnesignalService,
    private notificacion: MessagingService
  ) {
    
  }

  ngOnInit() {
    this.subscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => window.scrollTo(0, 0));
    this.swUpdate.available.subscribe(event => {
      this.toast
        .info('Actualizando!')
        .onHidden.subscribe(() => window.location.reload());
    });
    this.notificacion.receiveMessage().subscribe(payload => {
      console.log(payload);
      this.mesaggeReceived = payload.notification.title;
    })
    // this.onesignal.init();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
