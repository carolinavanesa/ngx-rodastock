import { Injectable } from "@angular/core";
import { NbGlobalPhysicalPosition, NbToastrService } from "@nebular/theme";

@Injectable()
export class AlertService {
  constructor(private toastrService: NbToastrService) {}

  showPrimaryToast(title: string, body: string, duration = 3000) {
    const config = {
      status: 'primary',
      destroyByClick: true,
      duration,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: false,
    };

    this.toastrService.show(
      body,
      title,
      config);
  }
}


