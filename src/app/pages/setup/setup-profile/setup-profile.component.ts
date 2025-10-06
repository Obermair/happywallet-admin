import { Component } from '@angular/core';
import { DataService } from '../../../data.service';
import { CommonModule } from '@angular/common';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { SetupService } from '../setup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setup-profile',
  imports: [InputFieldComponent, CommonModule, ButtonComponent],
  templateUrl: './setup-profile.component.html',
  styleUrl: './setup-profile.component.css'
})
export class SetupProfileComponent {

  isDragActive = false;
  uploadImage: File | null = null;
  imageUrl: string | null = null;
  errorMessageFileUpload = "";
  isLoading = false;

  user = {
    id: 0,
    username: '',
    email: '',
  };

  constructor(private router: Router,public dataService: DataService, public setupService: SetupService) {
    this.dataService.getCurrentUserPromise().then((user: any) => {
      this.user.id = user.id;
      this.user.username = user.username;
      this.user.email = user.email;
      if (this.dataService.currentUser.shopLogo) {
        this.imageUrl = this.dataService.apiUrl + this.dataService.currentUser.shopLogo.url;
      }
   });
  }

  isUserDataValid() {
    // check if username not empty and uploadImage is not null
    return this.user.username.trim() !== '' && this.imageUrl != null;
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
    if (this.imageUrl != null && this.uploadImage == null) {
      this.isLoading = true;
      this.dataService.updateUser(this.user).then(() => {
        this.dataService.getCurrentUserPromise().then(() => {
          this.isLoading = false;
          this.setupService.setStepToComplete(1);
          this.setupService.setStepToActive(2);
          this.router.navigate(['/setup/card']);
        });
      }); 
    }
    else if (this.imageUrl != null && this.uploadImage != null) {
      this.isLoading = true;
      this.dataService.uploadShopLogo(this.uploadImage).then(() => {
        this.uploadImage = null; // Optional: Setze das hochgeladene Bild zurück
        this.errorMessageFileUpload = "";

        this.dataService.updateUser(this.user).then(() => {
          this.dataService.getCurrentUserPromise().then(() => {
            this.isLoading = false;
            this.setupService.setStepToComplete(1);
            this.setupService.setStepToActive(2);
            this.router.navigate(['/setup/card']);
          });
        }); 
      }).catch((error) => {
        console.error('Fehler beim Hochladen des Bildes:', error);
        this.errorMessageFileUpload = "Fehler beim Hochladen des Bildes. Bitte versuchen Sie es erneut.";
      });
    }
    else {
      this.errorMessageFileUpload = "Bitte wählen Sie ein Bild zum Hochladen aus.";
    }
  }
}
