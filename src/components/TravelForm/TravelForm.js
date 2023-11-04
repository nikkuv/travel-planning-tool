import React, { useState } from 'react';
import { Form, Input, DatePicker, InputNumber, Button, Select, Space } from 'antd';


const TravelPlanForm = () => {
  const [form] = Form.useForm();
  const [currency, setCurrency] = useState('USD');

  const handleCurrencyChange = (value) => {
    setCurrency(value);
  };

  const onFinish = async (values) => {

    const payload = {
      destination: values.destination,
      datefrom: values.dates[0].format('YYYY-MM-DD'),
      dateto: values.dates[1].format('YYYY-MM-DD'),
      currencytype: currency,
      budget: values.budget,
      noofpeople: values.people,
    };
  
    const apiUrl = '/api/parse-message';

    try {
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [{ content: payload }] }),
      });
  
      const data = await response.json();
  
      console.log('API Response:', data);
  
    } catch (error) {
      console.error('API Error:', error);
    }
    

    console.log(values);
    console.log(prompt);

  };

  return (
    <Form form={form} name="travel_plan" onFinish={onFinish}>
      <Form.Item
        name="destination"
        label="Destination"
        rules={[{ required: true, message: 'Please input your destination!' }]}
      >
        <Input placeholder="Enter destination" />
      </Form.Item>

      <Form.Item
        name="dates"
        label="Travel Dates"
        rules={[{ required: true, message: 'Please select your travel dates!' }]}
      >
        <DatePicker.RangePicker />
      </Form.Item>

      <Form.Item
        name="budget"
        label="Budget"
        rules={[{ required: true, message: 'Please input your budget!' }]}
      >
        <Space>
          <Select
            value={currency}
            style={{ width: '80px' }}
            onChange={handleCurrencyChange}
          >
            <Select.Option value="USD">$</Select.Option>
            <Select.Option value="INR">₹</Select.Option>
          </Select>
          <InputNumber
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value.replace(/(\$|₹)\s?|(,*)/g, '')}
            placeholder="Enter budget"
          />
        </Space>
      </Form.Item>

      <Form.Item
        name="people"
        label="Number of People"
        rules={[{ required: true, message: 'Please input the number of people!' }]}
      >
        <InputNumber min={1} placeholder="Enter number of people" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Start Planning
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TravelPlanForm;
