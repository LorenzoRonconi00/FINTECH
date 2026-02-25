export function getFinancialPeriodForDate(date: Date, budgetStartDay: number): string {
    const day = date.getDate()
    const year = date.getFullYear()
    const month = date.getMonth()

    if (day >= budgetStartDay) {
        return formatPeriod(year, month + 1)
    } else {
        if (month === 0) {
            return formatPeriod(year - 1, 12)
        }
        return formatPeriod(year, month)
    }
}

export function getCurrentFinancialPeriod(budgetStartDay: number, timezone?: string): string {
    const now = timezone
        ? new Date(new Date().toLocaleString('en-US', { timeZone: timezone }))
        : new Date()
    return getFinancialPeriodForDate(now, budgetStartDay)
}

export function getFinancialPeriodRange(
    period: string,
    budgetStartDay: number
): { start: Date; end: Date } {
    const [yearStr, monthStr] = period.split('-')
    if (!yearStr || !monthStr) {
        throw new Error('Invalid period format')
    }
    const year = parseInt(yearStr, 10)
    const month = parseInt(monthStr, 10)

    const start = new Date(year, month - 1, budgetStartDay)

    let endYear = year
    let endMonth = month + 1
    if (endMonth > 12) {
        endMonth = 1
        endYear += 1
    }
    const end = new Date(endYear, endMonth - 1, budgetStartDay)

    return { start, end }
}

export function getPreviousFinancialPeriods(
    currentPeriod: string,
    count: number
): string[] {
    const periods: string[] = []
    const [yearStr, monthStr] = currentPeriod.split('-')
    if (!yearStr || !monthStr) {
        return periods
    }
    let year = parseInt(yearStr, 10)
    let month = parseInt(monthStr, 10)

    for (let i = 0; i < count; i++) {
        month -= 1
        if (month < 1) {
            month = 12
            year -= 1
        }
        periods.push(formatPeriod(year, month))
    }

    return periods
}

export function isTemplateActiveForPeriod(
    template: { start_month: string; end_month: string | null; is_active: boolean },
    period: string
): boolean {
    if (!template.is_active) return false
    if (period < template.start_month) return false
    if (template.end_month && period > template.end_month) return false
    return true
}

export function formatPeriod(year: number, month: number): string {
    return `${year}-${String(month).padStart(2, '0')}`
}

export function getLastNPeriods(fromPeriod: string, n: number): string[] {
    const periods: string[] = [fromPeriod]
    let year = parseInt(fromPeriod.slice(0, 4), 10)
    let month = parseInt(fromPeriod.slice(5, 7), 10)

    for (let i = 1; i < n; i++) {
        month -= 1
        if (month < 1) {
            month = 12
            year -= 1
        }
        periods.push(formatPeriod(year, month))
    }

    return periods
}