/* eslint-disable @typescript-eslint/no-empty-interface */
import { AttributifyAttributes } from '../../src/jsx';

declare module 'react' {
  interface HTMLAttributes<T> extends AttributifyAttributes {}
}
