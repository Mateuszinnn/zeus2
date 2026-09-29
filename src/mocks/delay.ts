/* Latência simulada.
 *
 * Toda operação mockada passa por aqui. Resposta instantânea denuncia a
 * ausência de backend na hora — numa demo comercial isso custa a venda.
 *
 * Referência: design system §6, PRODUCT.md "Capabilities and Constraints".
 */

const MIN_MS = 300
const MAX_MS = 600

export function delay(ms?: number): Promise<void> {
  const wait = ms ?? MIN_MS + Math.random() * (MAX_MS - MIN_MS)
  return new Promise((resolve) => setTimeout(resolve, wait))
}
