
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbDialogModule, NbWindowModule, NbCardModule, NbPopoverModule, NbButtonModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { ModalService } from './modal.service';

@NgModule({
  declarations: [ConfirmationModalComponent],
  imports: [
    FormsModule,
    ThemeModule,
    NbDialogModule.forChild(),
    NbWindowModule.forChild(),
    NbCardModule,
    NbPopoverModule,
    NbButtonModule,
  ],
  providers: [ModalService]
})
export class SharedModalModule { }
