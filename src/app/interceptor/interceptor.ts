import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpSentEvent,
    HttpHeaderResponse,
    HttpProgressEvent,
    HttpResponse,
    HttpUserEvent
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { UserService } from '../services/user.service';
import { MessagesService } from '../shared/messages/messages.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
    isRefreshingToken = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

    constructor(private UserService:UserService, private MessagesService:MessagesService ) { }

    addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
        return req.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

        // let apiReq = req.clone({setHeaders: {'Content-Type': 'application/json'}});
        const token: any = localStorage.getItem('token');
        return next.handle(this.addToken(req, token)).pipe(
            catchError((error: any) => {
                if(error.status == 401){
                    this.UserService.logout()
                }
                return throwError(() => {
                    if(error && error.error instanceof Blob){
                        this.MessagesService.set("Error on generating file", 'error')
                        return "Error on generating file";
                    }
                    if(error.error.message != "Invalid JWT Token"){
                        this.MessagesService.set(error.error.message, 'error')
                    }
                    return error.error.message
                })
            }))
    }
}
