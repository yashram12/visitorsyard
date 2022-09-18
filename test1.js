const calculateDistance = (
    lattitude1,
    longittude1,
    lattitude2,
    longittude2
  ) => {
    const toRadian = (n) => (n * Math.PI) / 180;

    let lat2 = lattitude2;
    let lon2 = longittude2;
    let lat1 = lattitude1;
    let lon1 = longittude1;

    // console.log(lat1, lon1 + "===" + lat2, lon2);
    let R = 6371; // km
    let x1 = lat2 - lat1;
    let dLat = toRadian(x1);
    let x2 = lon2 - lon1;
    let dLon = toRadian(x2);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadian(lat1)) *
        Math.cos(toRadian(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    console.log("distance==?", d);
    return d;
  };

  const totDist = (myOriginalPos, list) => {
    console.log(list)
    let dis = 0,
      myPos = myOriginalPos,
      minList = [],
      n = list.length;
    for (let i = 0; i < n; i++) {
      minList = list.map((el) => {
        return calculateDistance(myPos.lat, myPos.lng, el.lat, el.lng);
      });
      dis = dis + Math.min(...minList);
      [myPos] = list.splice(minList.indexOf(Math.min(...minList)), 1);
    }
    dis =
      dis +
      calculateDistance(
        myOriginalPos.lat,
        myOriginalPos.lng,
        myPos.lat,
        myPos.lng
      );
    return dis;
  };

console.log(totDist({lat:16.12,lng:77.21},[{ lat: 12.9507, lng: 77.5848 },{ lat: 13.3702, lng: 77.6835}]))
console.log(totDist({lat:16.12,lng:77.21},[{lat:13.1681000,lng:77.1681000}]))