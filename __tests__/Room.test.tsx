import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import Room from '../app/room/Room'

vi.mock('next/navigation', () => ({
    useRouter: () => ({ replace: vi.fn() }),
    useSearchParams: () => ({ get: () => 'test-room' }),
}))

vi.mock('../lib/socket', () => ({
    socket: {
        connect: vi.fn(),
        emit: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
    }
}))

Object.assign(navigator, {
    serviceWorker: {
        register: vi.fn().mockResolvedValue({}),
        ready: Promise.resolve({})
    },
    geolocation: {
        getCurrentPosition: vi.fn()
    }
})

global.fetch = vi.fn()
window.HTMLElement.prototype.scrollIntoView = vi.fn()

test('Room renders correctly', () => {
    render(<Room />)
    expect(screen.getByText(/Room : test-room/i)).toBeDefined()
})
