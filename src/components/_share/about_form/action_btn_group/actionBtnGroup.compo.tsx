import {Ban, SaveCheck, SquarePen} from "lucide-react";

interface Props {
    isEditing : boolean;
    onConfirm : ()=>void;
    onCancel : ()=>void;
    onEdit : ()=>void;
}


export function ActionBtnGroup({ isEditing , onConfirm , onCancel,onEdit }:Props) {


    return (
        <div>
            { isEditing?
                <div
                    className="flex items-center gap-3"
                >
                    <button
                        type="button"
                        onClick={ onConfirm}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-surface-hover hover:text-foreground"
                        aria-label="Change language"
                    >
                        <SaveCheck/>
                    </button>

                    <button
                        type="button"
                        onClick={ onCancel}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-surface-hover hover:text-foreground"
                        aria-label="Change language"
                    >
                        <Ban/>
                    </button>

                </div>
                :
                <button
                    type="button"
                    onClick={ onEdit}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-surface-hover hover:text-foreground"
                    aria-label="Change language"
                >
                    <SquarePen/>
                </button>
            }
        </div>
    )
}