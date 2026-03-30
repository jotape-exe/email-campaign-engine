export interface MessagePublisher {
    publish(queue: string, message: unknown): Promise<void>;
}