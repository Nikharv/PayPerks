import re

def extract_merchant_id(merchant_name):
    return int(merchant_name.split('_')[1])

def get_card_name(card_id):
    card_names = {
        1: 'U.S. Green',
        2: 'Wells Access Debit',
        3: 'Chase Travel Rewards'
    }
    return card_names.get(card_id, 'Unknown Card')

with open('offers_data.sql', 'r') as f:
    lines = f.readlines()

offers = []
for line in lines:
    if 'INSERT INTO offers_data' in line:
        continue
    if not line.strip().startswith('('):
        continue
        
    match = re.match(r'\((\d+),\s*(\d+),\s*\'(Merchant_\d+)\',\s*\'(\d+%)\',\s*\'([^\']+)\'', line)
    if match:
        offer_id = int(match.group(1))
        card_id = int(match.group(2))
        merchant_name = match.group(3)
        merchant_id = extract_merchant_id(merchant_name)
        card_name = get_card_name(card_id)
        description = match.group(5)
        
        offers.append(f"({offer_id}, {card_id}, {merchant_id}, '{merchant_name}', '{card_name}', '{description}')")

with open('new_offers.sql', 'w') as f:
    f.write("INSERT INTO offers_data (offer_id, card_id, merchant_id, merchant_name, card_name, offer_description) VALUES\n")
    f.write(',\n'.join(offers))
    f.write(';') 