import { Action } from './action.model';
import { Observable } from 'rxjs';

export type CallableEffect<S extends object, A extends Action> = (
  $state: Observable<S>,
  action$: Observable<A>
) => Observable<A>;
