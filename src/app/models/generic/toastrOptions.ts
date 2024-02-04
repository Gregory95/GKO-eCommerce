export class ToastrOptions {
    positionClass: string = 'toast-bottom-right';
    closeButton: boolean = true; // Show close button
    progressBar: boolean = true; // Show progress bar
    timeOut: number = 5000; // Time to live in milliseconds
    easing: string = 'fadeIn'; // Toast component easing
    easeTime: string | number = 300; // Time spent easing
    extendedTimeOut: number = 1000; // Time to close after a user hovers over toast
    disableTimeOut: boolean = false  // Disable both timeOut and extendedTimeOut when set to true. Allows specifying which timeOut to disable, either: timeOut or extendedTimeOut
    enableHtml: boolean = false; // Allow html in message
    newestOnTop: boolean = true  // New toast placement
    toastClass: string = 'ngx-toastr' // CSS class(es) for toast
    titleClass: string = 'toast-title' // CSS class(es) for inside toast on title
    messageClass: string = 'toast-message' // CSS class(es) for inside toast on message
    tapToDismiss: boolean = true // Close on click
    onActivateTick: boolean = false // Fires changeDetectorRef.detectChanges() when activated. Helps show toast from asynchronous events outside of Angular's change detection
}
