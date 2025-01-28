import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:my_app2/product.dart';  // Adjust the import path if necessary

class ApiService {
  final String apiUrl = 'http://192.168.24.99/phone_mart/test_products.php';

  Future<List<Product>> fetchProducts() async {
    final response = await http.get(Uri.parse(apiUrl));

    if (response.statusCode == 200) {
      List<dynamic> body = jsonDecode(response.body);
      return body.map((dynamic item) => Product.fromJson(item)).toList();
    } else {
      throw Exception('Failed to load products');
    }
  }
}

