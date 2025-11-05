import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-widget',
  template: `
    <div
      class="mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]"
    >
      <h3 class="mb-2 font-semibold text-gray-900 dark:text-white">
        happywallet for business
      </h3>
      <p class="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
        Zum Scannen der QR Codes benötigst du die happywallet for business App.
      </p>
<a
  href="https://play.google.com/apps/testing/at.happywallet.businessapp"
  target="_blank"
  rel="nofollow"
  class="flex items-center justify-center p-3 font-medium text-brand-500 rounded-lg border border-brand-500 border-2 text-theme-sm hover:bg-gray-100"
>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-google-play mr-2" viewBox="0 0 16 16">
  <path d="M14.222 9.374c1.037-.61 1.037-2.137 0-2.748L11.528 5.04 8.32 8l3.207 2.96zm-3.595 2.116L7.583 8.68 1.03 14.73c.201 1.029 1.36 1.61 2.303 1.055zM1 13.396V2.603L6.846 8zM1.03 1.27l6.553 6.05 3.044-2.81L3.333.215C2.39-.341 1.231.24 1.03 1.27"/>
</svg>
  Playstore
</a>

<a
  href="https://apps.apple.com/app/idXXXXXXXX"
  target="_blank"
  rel="nofollow"
  class="flex items-center mt-3 justify-center p-3 font-medium text-brand-500 rounded-lg border border-brand-500 border-2 text-theme-sm hover:bg-gray-100"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
    class="w-5 h-5 mr-2 fill-current text-brand-500"
  >
    <path d="M318.7 268.7c-.3-37.3 16.3-65.7 49.7-86.6-18.7-27.3-47-42.5-84.3-45.7-35.3-2.9-73.3 20.6-87 20.6-14 0-48.3-19.5-74.7-19-38.3.6-70.3 22.3-89 56.7-37.7 65.3-9.7 161.6 26.7 214.7 18.7 27 40.9 57.3 70.3 56 28-.6 38.7-18 72.7-18s44 18 72.7 17.3c29.3-.6 49.7-27.7 68.3-54.7 21.3-31 30-61 30.7-62.6-.7-.3-58.7-22.3-59.3-89.1zM255.7 72.7c26.7-32.3 24.3-61.7 23.3-72.7-23.3 1.3-50.3 15.7-66.3 34.7-17 20.3-26.7 45-24.7 71 25.3 2 48.7-10.3 67.7-33z"/>
  </svg>
  Appstore
</a>

    </div>
  `
})
export class SidebarWidgetComponent {} 