import {
  testUsers,
  testProducts,
  db_connect,
  db_clear,
} from './testing.dataset';
import * as process from 'process';

async function main() {
  await db_connect();
  await db_clear();

  for (const user of testUsers) {
    await user
      .save()
      .then((savedUser) => console.log('User saved successfully:', savedUser))
      .catch((err) => {
        console.error('Caught error while saving user:', err);
        throw err;
      });
  }

  for (const product of testProducts) {
    await product
      .save()
      .then((savedProduct) =>
        console.log('Product saved successfully:', savedProduct),
      )
      .catch((err) => {
        console.error('Caught error while saving product:', err);
        throw err;
      });
  }

  process.exit();
}

main();
