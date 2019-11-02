import { Action } from './models/action.model';
import { CallableActionReducer } from './models/callable-action-reducer.model';
import { CallableReducer } from './models/callable-reducer.model';
import { ReducersMapObject } from './models/reducers-map-object.model';
import { ActionPayloadType } from './models/action-payload-type.model';
import { CallableAction } from './models/callable-action.model';
import { CallableCombinedReducer } from './models/callable-combined-reducer.model';
import { MicroReducer } from './models/micro-reducer.model';

import { Observable, zip } from 'rxjs';
import { map, scan, startWith } from 'rxjs/operators';

export function on<S extends object, A extends CallableAction, P extends ActionPayloadType<A>>(
  callableAction: A,
  reducer: CallableReducer<S, P>
): MicroReducer<S, A> {
  return {
    type: (callableAction as any).type,
    reducer
  };
}

export function createReducer<S extends object>(
  state: S,
  ...reducers: Array<MicroReducer<S, any>>
): CallableActionReducer<S, Action> {
  const reducerMap = new Map<string, CallableReducer<S, any>>();
  reducers.forEach((reducer) => {
    reducerMap.set(reducer.type, reducer.reducer);
  });

  return ($action: Observable<Action>): Observable<S> => {
    return $action.pipe(
      startWith(state as object),
      scan((reducerState: S, action: Action) => {
        const reducer = reducerMap.get(action.type);
        return reducer ? reducer(reducerState, action.payload) : reducerState;
      })
    );
  };
}

export function combineReducers<S extends object, A extends Action>(
  reducers: ReducersMapObject<S, A>
): CallableCombinedReducer<A, S> {
  const keys = Object.keys(reducers);
  const values = Object.values(reducers);

  return ($action: Observable<A>): Observable<S> => {
    return zip(
      ...values.map(
        (reducer: CallableActionReducer<any, A>): Observable<any> => {
          return reducer.call(null, $action);
        }
      )
    ).pipe(
      map((state: Array<S[keyof S]>) => {
        const obj = {} as S;
        keys.map((key, index) => {
          obj[key] = state[index];
        });

        return obj;
      })
    );
  };
}
