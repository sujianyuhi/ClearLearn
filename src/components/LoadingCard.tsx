import { LoadingCard as UILoadingCard, LoadingText as UILoadingText } from './UI';

export default function LoadingCard() {
  return <UILoadingCard />;
}

export function LoadingText() {
  return <UILoadingText lines={3} />;
}
