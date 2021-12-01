import { AfterViewInit, Component, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-repuestos-mas-utilizados-pie',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class RepuestosMasUtilizadosPieComponent implements AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: any;
  @Input() data: any[];

  constructor(private theme: NbThemeService) {
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors = {
        primaryLight: '#903df4',
        successLight: '#8fcf50',
        infoLight: '#40bbf4',
        warningLight: '#ffbe43',
        dangerLight: '#cf3341',
      };
      const echarts: any = config.variables.echarts;


      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: this.data.map(x => x.nombre),
          textStyle: {
            color: echarts.textColor,
          },
        },
        series: [
          {
            name: 'Repuestos mas utilizados',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: this.data.map(x => ({ value: x.cantidad, name: x.nombre })),
            // data: [
            //   { value: 335, name: 'Germany' },
            //   { value: 310, name: 'France' },
            //   { value: 234, name: 'Canada' },
            //   { value: 135, name: 'Russia' },
            //   { value: 1548, name: 'USA' },
            // ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: echarts.itemHoverShadowColor,
              },
            },
            label: {
              normal: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
            },
          },
        ],
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
