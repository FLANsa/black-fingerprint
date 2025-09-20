  // ====== بيانات عامة ======
  let phones = [];
  let accessories = [];
  let accessoryCategories = [];
  let sales = [];
  let cart = [];

  // ملاحظة: نتوقع أن window.storage يوفّر الدوال التالية عندما تكون Firebase متاحة:
  // getPhones(), getAccessories(), getAccessoryCategories(), getSales()
  // إذا ما كانت متوفرة، بيصير التحميل من LocalStorage.

  document.addEventListener('DOMContentLoaded', async () => {
    await new Promise(r => setTimeout(r, 400)); // مهلة قصيرة لضمان تهيئة window.storage
    if (window.storage && window.storage.isFirebaseAvailable) {
      console.log('✅ Firebase متاح في صفحة المبيعات');
      await loadDataFromFirebase();
    } else {
      console.log('💾 استخدام localStorage كبديل');
      await loadDataFromLocalStorage();
    }
    updateProductTypeDropdown();
    setupArabicNumberSupport();
    loadProducts(); // أول تحميل
  });

  // ====== تحميل البيانات ======
  async function loadDataFromFirebase() {
    try {
      const [p, a, c, s] = await Promise.all([
        window.storage.getPhones?.() ?? [],
        window.storage.getAccessories?.() ?? [],
        window.storage.getAccessoryCategories?.() ?? [],
        window.storage.getSales?.() ?? []
      ]);
      phones = Array.isArray(p) ? p : [];
      accessories = Array.isArray(a) ? a : [];
      accessoryCategories = Array.isArray(c) ? c : [];
      sales = Array.isArray(s) ? s : [];
      console.log('📥 Firebase:', { phones: phones.length, accessories: accessories.length, categories: accessoryCategories.length, sales: sales.length });
    } catch (err) {
      console.error('❌ خطأ تحميل Firebase:', err);
      await loadDataFromLocalStorage();
    }
  }

  async function loadDataFromLocalStorage() {
    try {
      phones = JSON.parse(localStorage.getItem('phones') || '[]');
      accessories = JSON.parse(localStorage.getItem('accessories') || '[]');
      accessoryCategories = JSON.parse(localStorage.getItem('accessory_categories') || '[]');
      sales = JSON.parse(localStorage.getItem('sales') || '[]');
      console.log('📦 localStorage:', { phones: phones.length, accessories: accessories.length, categories: accessoryCategories.length, sales: sales.length });
    } catch (err) {
      console.error('❌ خطأ تحميل localStorage:', err);
      phones = []; accessories = []; accessoryCategories = []; sales = [];
    }
  }

  // ====== بيع الهاتف مرة واحدة ======
  function isPhoneSold(phoneId) {
    if (!sales || sales.length === 0) return false;
    return sales.some(sale =>
      Array.isArray(sale.items) &&
      sale.items.some(item => item.type === 'phone' && (item.id === phoneId || item.phone_id === phoneId))
    );
  }

  // ====== تعبئة قائمة نوع المنتج من Firebase ======
  function updateProductTypeDropdown() {
    const productTypeSelect = document.getElementById('product_type');
    productTypeSelect.innerHTML = '';

    // خيار افتراضي
    const base = document.createElement('option');
    base.value = '';
    base.textContent = 'اختر نوع المنتج';
    productTypeSelect.appendChild(base);

    // خيار هاتف (ثابت)
    const phoneOpt = document.createElement('option');
    phoneOpt.value = 'phone';
    phoneOpt.textContent = 'هاتف';
    productTypeSelect.appendChild(phoneOpt);

    // فئات الأكسسوارات من مجموعة accessory_categories في Firebase
    if (Array.isArray(accessoryCategories) && accessoryCategories.length > 0) {
      accessoryCategories.forEach(cat => {
        if (!cat?.name) return;
        const opt = document.createElement('option');
        opt.value = cat.name;         // القيمة هي اسم الفئة
        opt.textContent = cat.name;   // عرض اسم الفئة
        productTypeSelect.appendChild(opt);
      });
    } else {
      const noCat = document.createElement('option');
      noCat.value = '';
      noCat.textContent = 'لا توجد فئات أكسسوارات — أضف فئات من صفحة الأكسسوارات';
      noCat.disabled = true;
      productTypeSelect.appendChild(noCat);
    }

    console.log('✅ تم تحديث نوع المنتج:', productTypeSelect.options.length, 'خيار');
  }

  // ====== تحميل المنتجات حسب النوع المختار ======
  function loadProducts() {
    const productType = document.getElementById('product_type').value;
    const productSelect = document.getElementById('product_select');

    productSelect.innerHTML = '<option value="">اختر المنتج</option>';
    document.getElementById('product_details').style.display = 'none';

    if (!productType) return;

    if (productType === 'phone') {
      // هواتف غير مباعة
      const availablePhones = (phones || []).filter(ph => {
        const pid = ph.id || ph.phone_number;
        return pid && !isPhoneSold(pid);
      });

      if (availablePhones.length === 0) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'لا توجد هواتف متاحة للبيع';
        opt.disabled = true;
        productSelect.appendChild(opt);
        return;
      }

      availablePhones.forEach(ph => {
        const opt = document.createElement('option');
        opt.value = ph.id || ph.phone_number; // المعرّف
        const manufacturer = ph.manufacturer || ph.brand || '';
        const model = ph.model || '';
        const barcode = ph.phone_number || ph.serial_number || '';
        const price = Number(ph.selling_price) || 0;
        const purchase = Number(ph.purchase_price) || 0;

        opt.textContent = `${manufacturer} ${model} — باركود: ${barcode}`;
        opt.setAttribute('data-price', String(price));
        opt.setAttribute('data-purchase-price', String(purchase));
        opt.setAttribute('data-name', `${manufacturer} ${model}`.trim());
        opt.setAttribute('data-description', ph.description || '');
        opt.setAttribute('data-barcode', barcode);
        productSelect.appendChild(opt);
      });
    } else {
      // أكسسوارات بحسب اسم الفئة (من accessories)
      const availableAccessories = (accessories || []).filter(acc => {
        const stock = Number(acc.quantity_in_stock ?? acc.quantity ?? 0);
        return acc?.category === productType && stock > 0;
      });

      if (availableAccessories.length === 0) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'لا توجد أكسسوارات متاحة في هذه الفئة';
        opt.disabled = true;
        productSelect.appendChild(opt);
        return;
      }

      availableAccessories.forEach(acc => {
        const opt = document.createElement('option');
        opt.value = acc.id || acc.sku || '';
        const stock = Number(acc.quantity_in_stock ?? acc.quantity ?? 0);
        const price = Number(acc.selling_price ?? acc.price ?? 0);
        const purchase = Number(acc.purchase_price ?? 0);
        const displayName = (acc.arabic_name && acc.arabic_name !== acc.name) ? acc.arabic_name : (acc.name || '');

        opt.textContent = `${displayName} (المخزون: ${stock})`;
        opt.setAttribute('data-price', String(price));
        opt.setAttribute('data-purchase-price', String(purchase));
        opt.setAttribute('data-name', displayName);
        opt.setAttribute('data-description', acc.description || '');
        opt.setAttribute('data-stock', String(stock));
        // لمطابقة تحديث الكمية لاحقاً
        opt.setAttribute('data-id', opt.value);
        productSelect.appendChild(opt);
      });
    }
  }

  // ====== تفاصيل المنتج المختار ======
  function updateProductInfo() {
    const productSelect = document.getElementById('product_select');
    const selectedOption = productSelect.options[productSelect.selectedIndex];

    if (selectedOption && selectedOption.value) {
      document.getElementById('selected_product_name').textContent = selectedOption.getAttribute('data-name') || '-';
      document.getElementById('selected_product_description').textContent = selectedOption.getAttribute('data-description') || '-';
      document.getElementById('selected_product_price').textContent = selectedOption.getAttribute('data-price') || '0';
      updateTotalPrice();
      document.getElementById('product_details').style.display = 'block';
    } else {
      document.getElementById('product_details').style.display = 'none';
    }
  }

  function updateTotalPrice() {
    const price = parseFloat(document.getElementById('selected_product_price').textContent) || 0;
    const quantity = parseArabicNumber(document.getElementById('quantity').value) || 1;
    document.getElementById('total_price').textContent = (price * quantity).toFixed(2);
  }

  // ====== دعم الأرقام العربية ======
  function convertArabicToEnglishNumbers(str) {
    if (!str) return '';
    const map = {'٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9'};
    return str.toString().replace(/[٠-٩]/g, m => map[m] ?? m);
  }
  function parseArabicNumber(value) {
    if (!value || value.trim() === '') return 0;
    const converted = convertArabicToEnglishNumbers(value.toString());
    const num = parseFloat(converted);
    return isNaN(num) ? 0 : num;
  }
  function setupArabicNumberSupport() {
    document.querySelectorAll('.arabic-number-field').forEach(field => {
      field.addEventListener('input', function() {
        const pos = this.selectionStart;
        const cv = convertArabicToEnglishNumbers(this.value);
        if (cv !== this.value) {
          this.value = cv;
          this.setSelectionRange(pos, pos);
        }
      });
    });
  }

  // ====== إضافة للسلة ======
  function addToCart() {
    const productType = document.getElementById('product_type').value;
    const productSelect = document.getElementById('product_select');
    const quantity = parseArabicNumber(document.getElementById('quantity').value) || 1;

    if (!productType || !productSelect.value) {
      alert('يرجى اختيار نوع المنتج والمنتج');
      return;
    }

    const opt = productSelect.options[productSelect.selectedIndex];

    // تحقق مخزون الأكسسوارات
    if (productType !== 'phone') {
      const availableStock = parseInt(opt.getAttribute('data-stock')) || 0;
      if (availableStock < quantity) {
        alert(`الكمية المطلوبة (${quantity}) أكبر من المخزون (${availableStock})`);
        return;
      }
    }

    const unitPrice = parseFloat(opt.getAttribute('data-price')) || 0;
    const purchasePrice = parseFloat(opt.getAttribute('data-purchase-price') || '0') || 0;
    const profit = unitPrice - purchasePrice;

    const product = {
      id: productSelect.value,
      type: productType,
      name: opt.getAttribute('data-name') || '',
      description: opt.getAttribute('data-description') || '',
      unitPrice,
      purchasePrice,
      profit,
      quantity,
      totalPrice: unitPrice * quantity,
      totalProfit: profit * quantity
    };

    cart.push(product);
    updateCartDisplay();

    // reset
    document.getElementById('product_type').value = '';
    document.getElementById('product_select').innerHTML = '<option value="">اختر المنتج</option>';
    document.getElementById('quantity').value = '1';
    document.getElementById('product_details').style.display = 'none';
  }

  // ====== عرض وتلخيص السلة ======
  function updateCartDisplay() {
    const cartItems = document.getElementById('cart_items');
    const cartSummary = document.getElementById('cart_summary');

    if (cart.length === 0) {
      cartItems.innerHTML = '<p class="text-muted text-center">لا توجد منتجات في السلة</p>';
      cartSummary.style.display = 'none';
      return;
    }

    let html = '<div class="table-responsive"><table class="table table-sm">';
    html += '<thead><tr><th>المنتج</th><th>سعر الشراء</th><th>سعر البيع</th><th>الربح</th><th>الكمية</th><th>المجموع</th><th>إجمالي الربح</th><th>الإجراء</th></tr></thead><tbody>';

    cart.forEach((item, i) => {
      html += `
        <tr>
          <td>${item.name}</td>
          <td><span class="text-muted">${(item.purchasePrice || 0).toFixed(2)} ريال</span></td>
          <td>
            <div class="input-group input-group-sm">
              <input type="number" class="form-control" id="price_${i}"
                     value="${item.unitPrice.toFixed(2)}" step="0.01" min="0"
                     onchange="updateItemPrice(${i})" style="width: 80px;">
              <span class="input-group-text">ريال</span>
            </div>
          </td>
          <td><span class="text-success fw-bold">${(item.profit || 0).toFixed(2)} ريال</span></td>
          <td>
            <div class="input-group input-group-sm">
              <input type="number" class="form-control" id="quantity_${i}"
                     value="${item.quantity}" min="1"
                     onchange="updateItemQuantity(${i})" style="width: 60px;">
            </div>
          </td>
          <td>${item.totalPrice.toFixed(2)} ريال</td>
          <td><span class="text-success fw-bold">${(item.totalProfit || 0).toFixed(2)} ريال</span></td>
          <td><button class="btn btn-sm btn-danger" onclick="removeFromCart(${i})"><i class="fas fa-trash"></i></button></td>
        </tr>
      `;
    });

    html += '</tbody></table></div>';
    cartItems.innerHTML = html;

    updateCartSummary();
    cartSummary.style.display = 'block';
  }

  function updateCartSummary() {
    const totalWithVAT = cart.reduce((s, it) => s + it.totalPrice, 0);
    const subtotal = totalWithVAT / 1.15;
    const vat = totalWithVAT - subtotal;
    const total = totalWithVAT;
    const totalProfit = cart.reduce((s, it) => s + (it.totalProfit || 0), 0);
    const totalPurchaseCost = cart.reduce((s, it) => s + ((it.purchasePrice || 0) * it.quantity), 0);

    document.getElementById('cart_subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('cart_vat').textContent = vat.toFixed(2);
    document.getElementById('cart_total').textContent = total.toFixed(2);

    // أضف/حدّث صفوف تكلفة الشراء والربح
    const cartSummary = document.getElementById('cart_summary');
    let purchaseCostElement = document.getElementById('cart_purchase_cost');
    let profitElement = document.getElementById('cart_profit');

    if (!purchaseCostElement || !profitElement) {
      const row1 = document.createElement('div');
      row1.className = 'row mb-2';
      row1.innerHTML = `
        <div class="col-6"><strong>إجمالي سعر الشراء:</strong></div>
        <div class="col-6 text-end"><span id="cart_purchase_cost" class="text-muted">${totalPurchaseCost.toFixed(2)} ريال</span></div>
      `;
      const row2 = document.createElement('div');
      row2.className = 'row mb-2';
      row2.innerHTML = `
        <div class="col-6"><strong>إجمالي الربح المتوقع:</strong></div>
        <div class="col-6 text-end"><span id="cart_profit" class="text-success fw-bold">${totalProfit.toFixed(2)} ريال</span></div>
      `;
      cartSummary.insertBefore(row2, cartSummary.querySelector('.row:last-child'));
      cartSummary.insertBefore(row1, cartSummary.querySelector('.row:last-child'));
    } else {
      document.getElementById('cart_purchase_cost').textContent = totalPurchaseCost.toFixed(2) + ' ريال';
      document.getElementById('cart_profit').textContent = totalProfit.toFixed(2) + ' ريال';
    }

    document.getElementById('complete_sale_btn').disabled = cart.length === 0;
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
  }

  function updateItemPrice(index) {
    const newPrice = parseFloat(document.getElementById(`price_${index}`).value) || 0;
    if (newPrice < 0) {
      alert('السعر لا يمكن أن يكون سالباً');
      document.getElementById(`price_${index}`).value = cart[index].unitPrice.toFixed(2);
      return;
    }
    cart[index].unitPrice = newPrice;
    cart[index].profit = newPrice - (cart[index].purchasePrice || 0);
    cart[index].totalPrice = newPrice * cart[index].quantity;
    cart[index].totalProfit = cart[index].profit * cart[index].quantity;
    updateCartDisplay();
  }

  function updateItemQuantity(index) {
    const newQty = parseInt(document.getElementById(`quantity_${index}`).value) || 1;
    if (newQty < 1) {
      alert('الكمية يجب أن تكون 1 أو أكثر');
      document.getElementById(`quantity_${index}`).value = cart[index].quantity;
      return;
    }
    // تحقق مخزون الأكسسوارات
    if (cart[index].type !== 'phone') {
      const opt = document.querySelector(`option[data-id="${cart[index].id}"]`);
      const availableStock = parseInt(opt?.getAttribute('data-stock') || '0');
      if (availableStock && newQty > availableStock) {
        alert(`الكمية المطلوبة (${newQty}) أكبر من المخزون (${availableStock})`);
        document.getElementById(`quantity_${index}`).value = cart[index].quantity;
        return;
      }
    }
    cart[index].quantity = newQty;
    cart[index].totalPrice = cart[index].unitPrice * newQty;
    cart[index].totalProfit = cart[index].profit * newQty;
    updateCartDisplay();
  }

  // ====== البحث بالباركود (من الهواتف) ======
  function searchByBarcode() {
    const barcode = document.getElementById('barcode_search').value.trim();
    const resultDiv = document.getElementById('barcode_search_result');
    if (!barcode) { resultDiv.style.display = 'none'; return; }

    const foundPhone = (phones || []).find(ph => {
      const phBarcode = ph.phone_number || ph.serial_number;
      const pid = ph.id || ph.phone_number;
      return phBarcode && String(phBarcode) === barcode && !isPhoneSold(pid);
    });

    if (foundPhone) {
      const manufacturer = foundPhone.manufacturer || foundPhone.brand || '';
      const model = foundPhone.model || '';
      const price = Number(foundPhone.selling_price) || 0;
      const purchase = Number(foundPhone.purchase_price) || 0;
      const profit = price - purchase;

      resultDiv.innerHTML = `
        <div class="alert alert-success">
          <h6><i class="fas fa-mobile-alt"></i> تم العثور على الهاتف:</h6>
          <p><strong>${manufacturer} ${model}</strong></p>
          <p>الباركود: ${barcode} | السعر: ${price} ريال | سعر الشراء: ${purchase} ريال | الربح: ${profit.toFixed(2)} ريال</p>
          <button class="btn btn-sm btn-primary" onclick="selectPhoneByBarcode('${foundPhone.id || foundPhone.phone_number}')">
            <i class="fas fa-plus"></i> إضافة للسلة
          </button>
        </div>
      `;
      resultDiv.style.display = 'block';
    } else {
      const anyPhone = (phones || []).find(ph => (ph.phone_number || ph.serial_number) && String(ph.phone_number || ph.serial_number) === barcode);
      if (anyPhone && isPhoneSold(anyPhone.id || anyPhone.phone_number)) {
        resultDiv.innerHTML = `<div class="alert alert-danger"><i class="fas fa-times-circle"></i> هذا الهاتف تم بيعه مسبقاً</div>`;
      } else {
        resultDiv.innerHTML = `<div class="alert alert-warning"><i class="fas fa-exclamation-triangle"></i> لم يتم العثور على هاتف بالباركود: ${barcode}</div>`;
      }
      resultDiv.style.display = 'block';
    }
  }

  function selectPhoneByBarcode(phoneId) {
    const ph = (phones || []).find(p => (p.id || p.phone_number) === phoneId);
    if (!ph) return;
    const manufacturer = ph.manufacturer || ph.brand || '';
    const model = ph.model || '';
    const barcode = ph.phone_number || ph.serial_number || '';
    const sellingPrice = Number(ph.selling_price) || 0;
    const purchasePrice = Number(ph.purchase_price) || 0;
    const profit = sellingPrice - purchasePrice;

    cart.push({
      id: phoneId,
      type: 'phone',
      name: `${manufacturer} ${model}`.trim(),
      description: ph.description || '',
      unitPrice: sellingPrice,
      purchasePrice,
      profit,
      quantity: 1,
      totalPrice: sellingPrice,
      totalProfit: profit
    });
    updateCartDisplay();

    document.getElementById('barcode_search_result').style.display = 'none';
    document.getElementById('barcode_search').value = '';
    alert(`تم إضافة ${manufacturer} ${model} (باركود: ${barcode}) للسلة.\nسعر البيع: ${sellingPrice} ريال\nسعر الشراء: ${purchasePrice} ريال\nالربح: ${profit.toFixed(2)} ريال`);
  }

  // ====== إتمام عملية البيع (يحفظ في Firebase إن توفرت) ======
  async function completeSale() {
    if (cart.length === 0) { alert('السلة فارغة'); return; }

    const totalWithVAT = cart.reduce((s, it) => s + it.totalPrice, 0);
    const subtotal = totalWithVAT / 1.15;
    const vat = totalWithVAT - subtotal;
    const saleNumber = 'SALE-' + Date.now().toString().slice(-6);
    const totalProfit = cart.reduce((s, it) => s + (it.totalProfit || 0), 0);
    const totalPurchaseCost = cart.reduce((s, it) => s + ((it.purchasePrice || 0) * it.quantity), 0);

    const saleData = {
      sale_number: saleNumber,
      customer_name: document.getElementById('customer_name').value.trim() || 'عميل نقدي',
      customer_phone: document.getElementById('customer_phone').value.trim() || '',
      customer_email: document.getElementById('customer_email').value || '',
      customer_address: document.getElementById('customer_address').value || '',
      payment_method: document.getElementById('payment_method').value,
      notes: document.getElementById('notes').value || '',
      items: cart,
      subtotal, vat_amount: vat, total_amount: totalWithVAT,
      total_purchase_cost: totalPurchaseCost,
      total_profit: totalProfit,
      status: 'مكتمل',
      date_created: new Date().toISOString(),
      date_added: new Date().toISOString()
    };

    try {
      if (window.storage && window.storage.isFirebaseAvailable) {
        const saleId = await window.storage.addSale?.(saleData);
        if (!saleId) throw new Error('فشل حفظ البيع في Firebase');
        saleData.id = saleId;
      } else {
        const sales = JSON.parse(localStorage.getItem('sales') || '[]');
        saleData.id = Date.now().toString();
        sales.push(saleData);
        localStorage.setItem('sales', JSON.stringify(sales));
      }

      localStorage.setItem('lastSale', JSON.stringify(saleData));
      alert(`تم إنشاء عملية البيع!\nرقم العملية: ${saleNumber}\nقبل الضريبة: ${subtotal.toFixed(2)}\nالضريبة: ${vat.toFixed(2)}\nالإجمالي: ${totalWithVAT.toFixed(2)}\nسعر الشراء: ${totalPurchaseCost.toFixed(2)}\nالربح المتوقع: ${totalProfit.toFixed(2)}`);

      cart = [];
      updateCartDisplay();
      document.getElementById('customerForm')?.reset?.();

      setTimeout(() => {
        window.location.href = `view_sale.html?id=${saleData.id}`;
      }, 800);
    } catch (err) {
      console.error('❌ حفظ البيع:', err);
      alert('حدث خطأ في حفظ عملية البيع. حاول مرة أخرى.');
    }
  }

  // ====== تسجيل الخروج ======
  function logout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      localStorage.removeItem('current_user');
      alert('تم تسجيل الخروج بنجاح');
      window.location.href = 'index.html';
    }
  }
