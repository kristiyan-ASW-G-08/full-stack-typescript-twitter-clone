export default interface Notification {
  type: 'message' | 'warning' | 'alert';
  content: string;
  isActive: boolean;
}
