import { AfterViewInit, Component, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-encuestas-radar',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class EncuestasRadarComponent implements AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: any;

  @Input() serieValues: number[];

  constructor(private theme: NbThemeService) {
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      // const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: ['#903df4'],
        tooltip: {},
        legend: {
          data: ['Calificacion de usuarios'],
          textStyle: {
            color: echarts.textColor,
          },
        },
        radar: {
          name: {
            textStyle: {
              color: echarts.textColor,
            },
          },
          indicator: [
            { name: 'Atención' , max: 5 },
            { name: 'Calidad del trabajo', max: 5 },
            { name: 'Tiempo de entrega', max: 5 },
            { name: 'Precio', max: 5 },
          ],
          splitArea: {
            areaStyle: {
              color: 'transparent',
            },
          },
        },
        series: [
          {
            name: 'Encuestas de satisfaccion',
            type: 'radar',
            data: [
              {
                value: this.serieValues, //[4300, 10000, 28000, 35000, 50000, 19000],
                name: 'Puntuacion de usuarios',
              },
            ],
          },
        ],
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
