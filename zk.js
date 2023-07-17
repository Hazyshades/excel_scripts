// Получение балансов нативных токенов:

function getZkEthValue(address) {
  if (address) {
      const payload = {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "account_info",
        "params": [address]
      };
      const options = {
        'method': 'post',
        'contentType': 'application/json',
        'payload': JSON.stringify(payload)
      };
      const response = UrlFetchApp.fetch("https://api.zksync.io/jsrpc", options);
      const json = response.getContentText();
      const data = JSON.parse(json);
      const etherValue = parseFloat(data?.result?.committed?.balances?.ETH || 0)/1000000000000000000;
      const nonce = parseInt(data?.result?.committed?.nonce || 0);
      return [[etherValue,nonce]];
  } else {
      return [['','','']];
    }
}

/**
 * @customfunction
 */

function getZkEraEthValue(address) {
  if (address) {
      const response = UrlFetchApp.fetch("https://zksync2-mainnet-explorer.zksync.io/address/" + address, {'method': 'get'});
      const json = response.getContentText();
      const data = JSON.parse(json);
      const etherValue = parseInt(data?.info?.balances["0x0000000000000000000000000000000000000000"]?.balance || 0, 16)/1000000000000000000;
      const usdValue = parseFloat(data?.info?.balances["0x0000000000000000000000000000000000000000"]?.tokenInfo?.usdPrice || 0) * etherValue;
      const nonce = parseInt(data?.info?.sealedNonce || 0)
      return [[etherValue,usdValue,nonce]];
    
  } else {
      return [['','','']]
    }
}
function getFirstTransactionDate(address) {
  const url = "https://block-explorer-api.mainnet.zksync.io/transactions?address=" + address + "&limit=100&page=1";
  const response = UrlFetchApp.fetch(url);
  const json = response.getContentText();
  const data = JSON.parse(json);

  if (data && data.items && data.items.length > 0) {
    const firstTransaction = data.items[0];
    const receivedAt = new Date(firstTransaction.receivedAt);
    const formattedDate = formatDate(receivedAt);
    return formattedDate;
  } else {
    return "";
  }
}

// Функция для форматирования даты в формате "дд.мм.гг"
function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedDay = day < 10 ? "0" + day : day;
  const formattedMonth = month < 10 ? "0" + month : month;
  const formattedYear = year.toString().slice(-2);

  return formattedDay + "." + formattedMonth + "." + formattedYear;
}

// Функция для вызова из таблицы Excel
function testGetFirstTransactionDate(address) {
  const firstTransactionDate = getFirstTransactionDate(address);
  return firstTransactionDate;
}
