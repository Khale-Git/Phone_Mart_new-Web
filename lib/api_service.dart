import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:my_app2/product.dart';




class ApiService {
  static const hostConnect = "http://192.168.24.99/phone_mart";

  Future<List<Product>> fetchProducts() async {
    try {
      final response = await http.get(Uri.parse('$hostConnect/test_products.php'));

      if (response.statusCode == 200) {
        List<Product> products = (json.decode(response.body) as List)
            .map((data) => Product.fromJson(data))
            .toList();
        return products;
      } else {
        throw Exception('Failed to load products');
      }
    } catch (e) {
      throw Exception('Error occurred while fetching products: $e');
    }
  }
}

// TODO Implement this library.