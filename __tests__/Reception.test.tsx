import { render, screen, waitFor } from '@testing-library/react'
import { expect, test, vi, beforeEach } from 'vitest'
import Reception from '../app/reception/page'

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush })
}))

global.fetch = vi.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ data: {} }),
    })
) as unknown as typeof fetch

test('Reception renders correctly', async () => {
    render(<Reception />)

    // Check for main elements
    expect(screen.getByText('Se connecter')).toBeDefined()
    expect(screen.getByText('Pseudo')).toBeDefined()

    // Check if fetch was called
    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
    })
})
