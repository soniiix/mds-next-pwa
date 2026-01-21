import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Gallery from '../app/gallery/page'

test('Gallery renders correctly', () => {
    // Mock localStorage
    const galleryMock = JSON.stringify([{ id: 1, dataUrl: 'mock-url', createdAt: 123 }])
    Storage.prototype.getItem = (key) => key === 'galleryPhotos' ? galleryMock : null

    render(<Gallery />)

    expect(screen.getByText(/1 photos/i)).toBeDefined()
    expect(screen.getByText('Vider la galerie')).toBeDefined()
})
