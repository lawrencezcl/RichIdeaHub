import { NextRequest, NextResponse } from 'next/server'
import { CaseRepository } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const difficulty = searchParams.get('difficulty') || ''
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const cases = await CaseRepository.getAllCases(10000, 0) // Get all cases for filtering

    // Apply filters
    let filteredCases = cases

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredCases = filteredCases.filter(case_ =>
        case_.title.toLowerCase().includes(searchLower) ||
        case_.description.toLowerCase().includes(searchLower) ||
        (case_.tags && case_.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
        (case_.category && case_.category.toLowerCase().includes(searchLower))
      )
    }

    // Category filter
    if (category) {
      filteredCases = filteredCases.filter(case_ =>
        case_.category && case_.category.toLowerCase() === category.toLowerCase()
      )
    }

    // Difficulty filter
    if (difficulty) {
      filteredCases = filteredCases.filter(case_ =>
        case_.difficulty && case_.difficulty.toLowerCase() === difficulty.toLowerCase()
      )
    }

    // Sort
    filteredCases.sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a] || ''
      const bValue = b[sortBy as keyof typeof b] || ''

      // Handle numeric values
      if (sortBy === 'upvotes' || sortBy === 'comments_count') {
        const aNum = (aValue as number) || 0
        const bNum = (bValue as number) || 0
        return sortOrder === 'desc' ? bNum - aNum : aNum - bNum
      }

      // Handle string comparison
      if (sortOrder === 'desc') {
        return String(bValue).localeCompare(String(aValue))
      } else {
        return String(aValue).localeCompare(String(bValue))
      }
    })

    // Apply pagination after filtering
    const paginatedCases = filteredCases.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedCases,
      total: filteredCases.length,
      limit,
      offset,
      filters: {
        search,
        category,
        difficulty,
        sortBy,
        sortOrder
      }
    })

  } catch (error) {
    console.error('获取案例列表失败:', error)
    return NextResponse.json({
      success: false,
      error: '获取案例列表失败'
    }, { status: 500 })
  }
}