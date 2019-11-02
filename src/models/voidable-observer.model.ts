import { Observable } from 'rxjs';

export type VoidableObserver<T> = Observable<T> | void;
