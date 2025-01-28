class Product {
  final int id;
  final String name;
  final String description;
  final double price;
  final String imageUrl;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.imageUrl,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    // print('Parsing product from JSON: $json'); // Log the JSON data
    return Product(
      id: int.parse(json['id'].toString())  ,
      name: json['name'] as String,
      description: json['description'] as String,
      price: double.parse(json['price'].toString()),
      imageUrl: json['image_url'] as String,
    );
  }
}
