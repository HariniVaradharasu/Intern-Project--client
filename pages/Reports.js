import React, { useState, useEffect } from 'react';
import { Container, Form, Table, Button } from 'react-bootstrap';
import Sidenav from '../components/Sidenav';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Report = () => {
  const [reportType, setReportType] = useState('');
  const [data, setData] = useState({});
  const [tableHeaders, setTableHeaders] = useState({});

  useEffect(() => {
    if (reportType) {
      if (reportType === 'All') {
        fetchAllData();
      } else {
        fetchData(reportType);
      }
    }
  }, [reportType]);

  const fetchAllData = async () => {
    const types = ['Category', 'Subcategory', 'Inventory', 'StockIn', 'StockOut'];
    const allData = {};

    for (const type of types) {
      const response = await fetchData(type, true); // Fetch data for each type
      if (response) {
        allData[type] = response;
      }
    }

    setData(allData);
  };

  const fetchData = async (type, forAll = false) => {
    let url = '';
    let headers = [];
    let keyMap = {};

    switch (type) {
      case 'Category':
        url = 'http://localhost:7000/api/categories/getCategories';
        headers = ['S.No', 'Category Name', 'Category Code', 'Status'];
        keyMap = {
          'Category Name': 'categoryname',
          'Category Code': 'categorycode',
          'Status': 'status',
        };
        break;
      case 'Subcategory':
        url = 'http://localhost:7000/api/subcategories/getSubcategories';
        headers = ['S.No', 'Category Code', 'Category Name', 'Subcategory Code', 'Subcategory Name'];
        keyMap = {
          'Category Code': 'categoryCode',
          'Category Name': 'categoryName',
          'Subcategory Code': 'subcategoryCode',
          'Subcategory Name': 'subcategoryName',
        };
        break;
      case 'Inventory':
        url = 'http://localhost:7000/api/inventories/getInventories';
        headers = [
          'S.No', 'Category Name', 'Subcategory Name', 'Product Name', 'Cost',
          'Marked Price', 'Min Level', 'Min Order', 'HSN Code', 'GST', 'Quantity',
        ];
        keyMap = {
          'Category Name': 'categoryName',
          'Subcategory Name': 'subcategoryName',
          'Product Name': 'productName',
          'Cost': 'cost',
          'Marked Price': 'markedPrice',
          'Min Level': 'minLevel',
          'Min Order': 'minOrder',
          'HSN Code': 'hsnCode',
          'GST': 'gst',
          'Quantity': 'quantity',
        };
        break;
      case 'StockIn':
        url = 'http://localhost:7000/api/items/getItems';
        headers = [
          'S.No', 'Bill Code', 'Bill Date', 'Product Code', 'Vendor Name',
          'Item Code', 'Item Name', 'Quantity', 'Mrp', 'Cost', 'Discount', 'GST%',
          'CESS%', 'Total',
        ];
        keyMap = {
          'Bill Code': 'billNumber',
          'Bill Date': 'billDate',
          'Product Code': 'productCode',
          'Vendor Name': 'vendorName',
          'Item Code': 'itemCode',
          'Item Name': 'itemName',
          'Quantity': 'quantity',
          'Mrp': 'mrp',
          'Cost': 'cost',
          'Discount': 'discount',
          'GST%': 'gstPercent',
          'CESS%': 'cessPercent',
          'Total': 'total',
        };
        break;
      case 'StockOut':
        url = 'http://localhost:7000/api/exits/getItems';
        headers = [
          'S.No', 'Item Code', 'Item Name', 'Batch Code', 'Available Quantity',
          'Transfer Quantity', 'GST%', 'Mrp', 'Price',
        ];
        keyMap = {
          'Item Code': 'itemCode',
          'Item Name': 'itemName',
          'Batch Code': 'batchCode',
          'Available Quantity': 'availableQty',
          'Transfer Quantity': 'transferQty',
          'GST%': 'gstPercent',
          'Mrp': 'mrp',
          'Price': 'price',
        };
        break;
      default:
        break;
    }

    if (url) {
      try {
        const response = await axios.get(url);
        const formattedData = response.data.map((item, index) => {
          const formattedRow = { 'S.No': index + 1 };
          Object.keys(keyMap).forEach((header) => {
            if (type === 'StockIn' && header === 'Bill Date') {
              formattedRow[header] = item[keyMap[header]]
                ? new Date(item[keyMap[header]]).toISOString().split('T')[0]
                : '-';
            } else {
              formattedRow[header] = item[keyMap[header]] || '-';
            }
          });
          return formattedRow;
        });

        if (!forAll) {
          setData({ [type]: formattedData });
          setTableHeaders({ [type]: headers });
        }

        setTableHeaders((prev) => ({ ...prev, [type]: headers }));
        return formattedData;
      } catch (error) {
        console.error(Error fetching ${type} data:, error);
        return [];
      }
    }
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    Object.keys(data).forEach((type, index) => {
      const sectionTitle = ${type} List;
      const tableRows = data[type]?.map((row) => Object.values(row)) || [];
      const headers = tableHeaders[type] || [];
      if (index !== 0) doc.addPage();
      doc.text(sectionTitle, 14, 10);
      doc.autoTable({
        startY: 20,
        head: [headers],
        body: tableRows,
        theme: 'striped',
      });
    });
    doc.save('All_Reports.pdf');
  };

  return (
    <div className="d-flex">
      <Sidenav />
      <Container style={{ marginTop: '7rem' }}>
        <h1 className="text-center mb-3">Reports</h1>
        <Form className="mb-4 d-flex align-items-center justify-content-center" style={{ width: '20rem' }}>
          <Form.Group controlId="reportType" className="d-flex align-items-center mb-0">
            <Form.Label className="me-2 mb-0">Select Report Type</Form.Label>
            <Form.Control
              as="select"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              style={{ flex: 1 }}
            >
              <option value="">Choose</option>
              <option value="Category">Category</option>
              <option value="Subcategory">Subcategory</option>
              <option value="Inventory">Inventory</option>
              <option value="StockIn">Stock Inward</option>
              <option value="StockOut">Stock Outward</option>
              <option value="All">All</option>
            </Form.Control>
          </Form.Group>
        </Form>
        {reportType === 'All'
          ? Object.keys(data).map((type) => (
              <div key={type}>
                <h4 className="mt-5">{type} Data</h4>
                {data[type]?.length > 0 ? (
                  <Table striped bordered hover>
                    <thead className="table-dark">
                      <tr>
                        {tableHeaders[type]?.map((header, index) => (
                          <th key={index}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data[type]?.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {Object.values(row).map((value, colIndex) => (
                            <td key={colIndex}>{value}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p>No data available.</p>
                )}
              </div>
            ))
          : data[reportType]?.length > 0 && (
              <Table striped bordered hover>
                <thead className="table-dark">
                  <tr>
                    {tableHeaders[reportType]?.map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data[reportType]?.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((value, colIndex) => (
                        <td key={colIndex}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
        <Button className="mt-4" variant="primary" onClick={handleDownload}>
          Download PDF
        </Button>
      </Container>
    </div>
  );
};

export default Report;