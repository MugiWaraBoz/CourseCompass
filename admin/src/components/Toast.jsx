import { BadgeCheck, X } from 'lucide-react';
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

/**
 * Fixed top-right toast, shared by AllStudent / AllFaculty / AllCourses.
 * Wrapping the Alert in this dedicated `fixed` container (rather than
 * putting `fixed` directly on Alert's className) avoids specificity
 * collisions with any positioning classes baked into the Alert component.
 */
export function Toast({ message, visible, onClose }) {
  if (!message) return null;

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[9999] w-[min(24rem,calc(100vw-2rem))]">
      <Alert
        className={`pointer-events-auto border border-cyan-400/25 bg-slate-900/95 text-slate-200 shadow-2xl shadow-cyan-950/50 backdrop-blur-md transition-all duration-300 ease-out ${
          visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
        }`}
      >
        <BadgeCheck className="h-4 w-4 text-cyan-300" />
        <AlertTitle className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">
          Done
        </AlertTitle>
        <AlertDescription className="text-sm text-slate-300">
          {message}
        </AlertDescription>
        <AlertAction
          onClick={onClose}
          className="text-slate-500 transition-colors hover:text-white"
        >
          <X className="h-4 w-4" />
        </AlertAction>
      </Alert>
    </div>
  );
}

export default Toast;
