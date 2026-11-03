import { connect, type ConfirmChannel } from "amqplib";

export const IMAGE_QUEUE = "image-processing";

export async function withImageChannel<T>(
  url: string,
  useChannel: (channel: ConfirmChannel) => Promise<T>,
): Promise<T> {
  const connection = await connect(url);
  connection.on("error", (error) => console.error("RabbitMQ connection error:", error));

  try {
    const channel = await connection.createConfirmChannel();
    channel.on("error", (error) => console.error("RabbitMQ channel error:", error));
    await channel.assertQueue(IMAGE_QUEUE, {
      durable: true,
      arguments: { "x-queue-type": "quorum", "x-dead-letter-exchange": "", "x-dead-letter-routing-key": "image-processing-failed" },
    });
    await channel.assertQueue("image-processing-failed", { durable: true });
    return await useChannel(channel);
  } finally {
    await connection.close().catch(() => undefined);
  }
}
