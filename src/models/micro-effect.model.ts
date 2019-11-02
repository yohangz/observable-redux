import { Action } from './action.model';
import { Observable } from 'rxjs';
import { VoidableObserver } from './voidable-observer.model';

export type MicroEffect<S extends object, A extends Action> = (
  $state: Observable<S>,
  action$: Observable<A>
) => VoidableObserver<A>;
