import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      Created with ♥ by CarolinaVanesaBlanco88... powered by
      <b><a href="https://akveo.page.link/8V2f" target="_blank">Akveo</a></b>
      2021
    </span>

    <div class="socials">
      <a
        href="
  https://www.instagram.com/rodastock_ps/"
        target="_blank"
      >
        <img
          style="width: 22px"
          src="https://www.edigitalagency.com.au/wp-content/uploads/new-instagram-logo-white-border-icon-png-large.png"
        />
      </a>

      <nb-icon
      class="ml-4"
      icon="email-outline"
      pack="eva"
      (click)="mailTo()"
    ></nb-icon>
    </div>
  `,
})
export class FooterComponent {
  mailTo() {
    window.open('mailto:rodastockapp@gmail.com', '_blank')
  }
}
