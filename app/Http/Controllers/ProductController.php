<?php

namespace App\Http\Controllers;

use App\Services\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        private readonly ProductService $productService
    ) {}

    public function index(Request $request): Response
    {
        $sort = $request->string('sort', 'latest')->toString();
        $products = $this->productService->getPaginatedProducts(
            $request->integer('per_page', config('shop.pagination.per_page')),
            $sort
        );

        return Inertia::render('Products/Index', [
            'products' => $products,
            'currentSort' => $sort,
        ]);
    }

    public function show(int $id): Response
    {
        $product = $this->productService->getProduct($id);

        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }
}
