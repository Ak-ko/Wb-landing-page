export function formatCurrency(amount: number, locale: string = 'my-MM', currency: string = 'MMK'): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0, // MMK usually has no decimal
        maximumFractionDigits: 0,
    }).format(amount);
}
