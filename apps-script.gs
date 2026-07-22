/**
 * UofT Run Club Merch — order receiver
 * Paste this into the Apps Script editor that opens from your Google Sheet
 * (Extensions ▸ Apps Script), then Deploy ▸ New deployment ▸ Web app.
 * Deploy settings:  Execute as = Me   |   Who has access = Anyone
 * Copy the resulting /exec URL into ORDER_ENDPOINT in index.html.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName('Orders') || ss.insertSheet('Orders');
    var headers = ['Timestamp','Order Ref','Name','Email','Phone','Item','Fit','Colour','Size','Qty','Item Price ($)','Line Total ($)','Order Total ($)','Notes','Paid?'];

    if (sh.getLastRow() === 0) {
      sh.appendRow(headers);
      sh.getRange(1,1,1,headers.length).setFontWeight('bold');
      sh.setFrozenRows(1);
    }

    var ts = new Date();                    // one real Date object, shared by every row in this order
    var items = data.items || [];
    items.forEach(function (item) {
      sh.appendRow([
        ts,
        data.ref || '',
        data.name || '',
        data.email || '',
        data.phone || '',
        item.name || '',
        item.cut || '',
        item.color || '',
        item.size || '',
        item.qty || 0,
        item.price || 0,
        (item.qty || 0) * (item.price || 0),
        data.total || 0,
        data.notes || '',
        ''                       // "Paid?" — you tick this by hand as e-transfers land
      ]);
    });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, ref: data.ref }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Lets you open the URL in a browser to confirm it's live.
function doGet() {
  return ContentService.createTextOutput('UofT Run Club Merch order endpoint is live.');
}
