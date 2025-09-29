import { Component, EventEmitter } from '@angular/core';
import { InputFieldComponent } from './../../form/input/input-field.component';
import { ModalService } from '../../../services/modal.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../ui/modal/modal.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { AvatarTextComponent } from '../../ui/avatar/avatar-text.component';
import { DataService } from '../../../../data.service';

@Component({
  selector: 'app-user-meta-card',
  imports: [
    CommonModule,
    ModalComponent,
    InputFieldComponent,
    ButtonComponent
  ],
  templateUrl: './user-meta-card.component.html',
  styles: ``
})
export class UserMetaCardComponent {

  isProfileOpen = false;
  openProfileModal() { this.isProfileOpen = true; }
  closeProfileModal() { this.isProfileOpen = false; }


  isChangePasswordOpen = false;
  openChangePasswordModal() { this.isChangePasswordOpen = true; }
  closeChangePasswordModal() { this.isChangePasswordOpen = false; }

  errorMessagePasswordChange = "";

  currentPassword = '';
  newPassword = '';
  confirmNewPassword = '';

  isDragActive = false;
  uploadImage: File | null = null;
  imageUrl: string | null = null;
  errorMessageFileUpload = "";
  isLoading = false;

  user = {
    id: 0,
    username: '',
    email: '',
    street: '',
    city: '',
    zipCode: '',
    country: ''
  };

  constructor(public modal: ModalService, public dataService: DataService) {
    this.dataService.getCurrentUserPromise().then((user: any) => {
      this.user.id = user.id;
      this.user.username = user.username;
      this.user.email = user.email;
      this.user.street = user.street;
      this.user.city = user.city;
      this.user.zipCode = user.zipCode;
      this.user.country = user.country;
    }
    );
  }

  getProfileImage() {
    if (this.uploadImage != null) {
      return this.imageUrl;
    } else if (this.dataService.currentUser?.shopLogo?.url) {
      return this.dataService.apiUrl + this.dataService.currentUser.shopLogo.url;
    } else {
      return 'images/image.png'; // Pfad zum Platzhalterbild
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragActive = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragActive = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragActive = false;
    if (event.dataTransfer && event.dataTransfer.files.length) {
      const files = event.dataTransfer.files;

      if(files.length > 1){
        this.errorMessageFileUpload = 'Sie können nur ein Bild hochladen.';
        return;
      }

      if (files[0].size > 5 * 1024 * 1024) {
        this.errorMessageFileUpload = 'Dateigröße überschreitet das Limit von 5MB.';
        return;
      }

      // Typ (png, jpg, jpeg) überprüfen
      if (files[0].type != 'image/png' && files[0].type != 'image/jpeg' && files[0].type != 'image/jpg') {
        this.errorMessageFileUpload = 'Nur PNG und JPG Dateien sind erlaubt.';
        return;
      }

      this.errorMessageFileUpload = '';
      this.uploadImage = files[0];
      if (this.uploadImage) {
        this.imageUrl = URL.createObjectURL(this.uploadImage);
      } else {
        this.imageUrl = null;
      }
    }
  }

  onFileChange(event: any) {
    console.log(event);
  
    // Ausgewählte Dateien abrufen
    const files = event.target.files;
    
    if(files.length > 1){
      this.errorMessageFileUpload = 'Sie können nur ein Bild hochladen.';
      return;
    }

    if (files[0].size > 5 * 1024 * 1024) {
      this.errorMessageFileUpload = 'Dateigröße überschreitet das Limit von 5MB.';
      return;
    }

    // Typ (png, jpg, jpeg) überprüfen
    if (files[0].type != 'image/png' && files[0].type != 'image/jpeg' && files[0].type != 'image/jpg') {
      this.errorMessageFileUpload = 'Nur PNG und JPG Dateien sind erlaubt.';
      return;
    }

    this.errorMessageFileUpload = '';
    this.uploadImage = files[0];
    if (this.uploadImage) {
      this.imageUrl = URL.createObjectURL(this.uploadImage);
    } else {
      this.imageUrl = null;
    }
  }

  getImgUrl(){
    if (this.uploadImage != null) {
      return this.imageUrl;
    } else {
      return this.dataService.apiUrl + this.dataService.currentUser.shopLogo.url;
    }
  }

  removeUploadedImage(event: DragEvent | MouseEvent) {
    event.preventDefault();
    this.uploadImage = null;
    this.errorMessageFileUpload = "";
  }

  handleSave() {
    if (this.uploadImage) {
      this.isLoading = true;
      this.dataService.uploadShopLogo(this.uploadImage).then(() => {
        this.uploadImage = null; // Optional: Setze das hochgeladene Bild zurück
        this.errorMessageFileUpload = "";

        this.dataService.updateUser(this.user).then(() => {
          this.dataService.getCurrentUserPromise().then(() => {
            this.isLoading = false;
            this.closeProfileModal();
          });
        }); 
      }).catch((error) => {
        console.error('Fehler beim Hochladen des Bildes:', error);
        this.errorMessageFileUpload = "Fehler beim Hochladen des Bildes. Bitte versuchen Sie es erneut.";
      });
    }
    else {
      this.dataService.updateUser(this.user).then(() => {
        this.closeProfileModal();
      });
    }
  }

  changePassword() {
    if (this.newPassword !== this.confirmNewPassword) {
      this.errorMessagePasswordChange = "Die neuen Passwörter stimmen nicht überein.";
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessagePasswordChange = "Das neue Passwort muss mindestens 6 Zeichen lang sein.";
      return;
    }

    this.dataService.changePassword(this.currentPassword, this.newPassword).then(() => {
      this.closeChangePasswordModal();
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmNewPassword = '';
      this.errorMessagePasswordChange = "";
    }).catch((error) => {
      console.error('Fehler beim Ändern des Passworts:', error);
      this.errorMessagePasswordChange = "Fehler beim Ändern des Passworts. Bitte überprüfen Sie Ihr aktuelles Passwort.";
    });
  }
}