/*
原作者: kelv1n1n (https://github.com/kelv1n1n)
*/
const url = $request.url || "";
let body = $response.body;

if (!body) {
  $done({});
} else {
  try {
    const obj = JSON.parse(body);

    const search = "/banner/search_component_banner";
    const mine = "position_types=60%2C560%2C850%2C860%2C890%2C2400";
    const search_hot = "/search/hot_keywords";
    const recommend = "/resource_preload/list_h5_resource";
    const recommendPro = "/recommendation/interests/products";
    const adv = "/advertisement/v1";

    if (url.includes(mine) || url.includes(search) || url.includes(search_hot)) {
      obj.data = [];
    } else if (url.includes(recommend)) {
      if (Array.isArray(obj.data)) {
        obj.data = obj.data.filter((item) => item && item.filename !== "RecommendProduct.29e31893.js");
      }
    } else if (url.includes(recommendPro)) {
      if (obj.data && typeof obj.data === "object") {
        obj.data.activities = [];
        obj.data.products = [];
      }
    } else if (url.includes(adv)) {
      if (Array.isArray(obj.data)) {
        obj.data = obj.data
          .filter((item) => item && ![30, 50, 90, 320, 100].includes(item.region_code))
          .map((item) => {
            if (item.region_code === 2 && Array.isArray(item.positions)) {
              item.positions = item.positions.filter(
                (position) => position && ![890, 60].includes(position.component_code)
              );
            }
            return item;
          });
      }
    } else if (Array.isArray(obj.data)) {
      const typeArr = [50, 2, 90, 770, 80, 320];
      obj.data = obj.data.filter((item) => item && !typeArr.includes(item.position_type));
    }

    body = JSON.stringify(obj);
    $done({ body });
  } catch (e) {
    $done({});
  }
}
