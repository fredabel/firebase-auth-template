
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  redirect?: string;
};

const ErrorDialog: React.FC<Props> = ({ open, onClose, title = 'Something went wrong', message, redirect }) => {

	const navigate = useNavigate()

  	return (
		<Dialog open={open} onClose={onClose} className="relative z-50">
			<DialogBackdrop transition className="fixed inset-0 bg-gray-500/75 transition-opacity
						data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150"
			/>

			<div className="fixed inset-0 z-50 grid place-items-center p-4">
				<DialogPanel
				transition
				className="text-center w-full max-w-sm rounded-lg bg-white p-6 shadow-xl ring-1 ring-black/5
							data-[closed]:scale-95 data-[closed]:opacity-0
							data-[enter]:duration-200 data-[leave]:duration-150"
				>
					<div className="flex flex-col items-center gap-3">
						<div className="mt-0.5 rounded-full bg-red-100 p-2">
							<ExclamationTriangleIcon className="size-5 text-red-600" />
						</div>
						<div className="flex-1">
							<DialogTitle className="text-base font-semibold text-gray-900">
								{title}
							</DialogTitle>
							<p className="mt-1 text-sm text-gray-700">{message}</p>
						</div>
					</div>

					<div className="mt-4 flex justify-center">
						<button
							onClick={()=> {
								onClose(); 
								}
							}
							className="cursor-pointer inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
						>
							Close
						</button>
					</div>
				</DialogPanel>
			</div>
		</Dialog>
  	);
};

export default ErrorDialog;
