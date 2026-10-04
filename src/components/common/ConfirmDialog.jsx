import Modal from './Modal'
export default function ConfirmDialog({title='Please confirm',message,onClose,onConfirm}) {return <Modal title={title} onClose={onClose}><p>{message}</p><div className="form-actions"><button className="button secondary" onClick={onClose}>Cancel</button><button className="button danger" onClick={onConfirm}>Confirm</button></div></Modal>}
