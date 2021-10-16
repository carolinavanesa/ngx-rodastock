import { Injectable } from "@angular/core";
import { NbDialogService, NbGlobalPhysicalPosition } from "@nebular/theme";
import { take } from "rxjs/operators";
import { ConfirmationModalComponent } from "./confirmation-modal/confirmation-modal.component";

@Injectable()
export class ModalService {
  constructor(private dialogService: NbDialogService) {}

  showConfirmationModal(config: any){
    return this.dialogService.open(ConfirmationModalComponent, {
      context: config,
    }).onClose.pipe(take(1)).toPromise()
  }
}
