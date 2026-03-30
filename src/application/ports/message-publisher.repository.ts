export interface MessagePublisher {
    publish(queue: string, message: unknown, options?: any): Promise<void>;
}