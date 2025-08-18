
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

type Props = {
  open: boolean;
  onClose: () => void;
};



const LoadingDialog: React.FC<Props> = ({ open, onClose}) => {

  	return (
		<Dialog
            open={open}
            onClose={onClose}
            className="relative z-50"
        >
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-900/50 transition-opacity
                        data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150"
            />

            <div className="fixed inset-0 z-50 grid place-items-center p-4">
                <DialogPanel
                    transition
                    className="text-center w-full max-w-sm rounded-lg bg-white p-6 shadow-xl ring-1 ring-black/5
                                data-[closed]:scale-95 data-[closed]:opacity-0
                                data-[enter]:duration-200 data-[leave]:duration-150"
                    >
                    <div className="flex justify-center items-center  gap-3">
                        <svg className="size-5 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                        </svg>
                        <div className="">
                            <DialogTitle className="text-base font-semibold text-gray-900">
                                Processing…
                            </DialogTitle>
                        </div>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
  	);
};

export default LoadingDialog;
