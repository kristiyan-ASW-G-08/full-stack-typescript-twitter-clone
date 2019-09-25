export default interface Notification {
  type: 'message' | 'warning';
  content: string;
  isActive: boolean;
}
